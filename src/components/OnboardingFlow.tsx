import React, { useState } from 'react';
// Some build tools, like Vite, are particular and need the full file extension.
import  supabase  from '../lib/supabaseClient.ts'; // Added .ts extension
import { User } from '@supabase/supabase-js';

// --- Types ---
type OnboardingStep =
  | 'welcome'
  | 'survey'
  | 'promptStudy'
  | 'reviewStudy'
  | 'promptMeal'
  | 'reviewMeal'
  | 'unlock';

interface SurveyData {
  studyPreference: string;
  diningPreference: string;
  primaryFactor: string;
}

interface ReviewData {
  spotName: string;
  rating: number;
  reviewText: string;
  specificSpot: string;
  type: 'study' | 'dining';
}

interface Props {
  user: User;
  setProfile: React.Dispatch<React.SetStateAction<any>>;
}

// --- The Component ---
const OnboardingFlow: React.FC<Props> = ({ user, setProfile }) => {
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [surveyData, setSurveyData] = useState<SurveyData>({
    studyPreference: '',
    diningPreference: '',
    primaryFactor: '',
  });
  const [studyReview, setStudyReview] = useState<Omit<ReviewData, 'type'>>({
    spotName: '',
    rating: 3,
    reviewText: '',
    specificSpot: '',
  });
  const [mealReview, setMealReview] = useState<Omit<ReviewData, 'type'>>({
    spotName: '',
    rating: 3,
    reviewText: '',
    specificSpot: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  // --- Form Handlers ---
  const handleSurveyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSurveyData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStudyReviewChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setStudyReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleMealReviewChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setMealReview((prev) => ({ ...prev, [name]: value }));
  };

  // --- Submission Logic ---
  const submitOnboardingData = async () => {
    setIsLoading(true);
    try {
      // 1. Save Survey Data to 'profiles' table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          preferences: surveyData, // Assumes you have a JSONB column 'preferences'
          is_onboarded: true, // <<< SET THE FLAG TO TRUE!
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // 2. Format and save reviews to 'reviews' table
      const reviewsToInsert = [
        {
          user_id: user.id,
          spot_name: studyReview.spotName,
          rating: studyReview.rating,
          review_text: studyReview.reviewText,
          specific_spot: studyReview.specificSpot,
          type: 'study',
        },
        {
          user_id: user.id,
          spot_name: mealReview.spotName,
          rating: mealReview.rating,
          review_text: mealReview.reviewText,
          specific_spot: mealReview.specificSpot,
          type: 'dining',
        },
      ];

      const { error: reviewError } = await supabase
        .from('reviews') // Assuming you have a 'reviews' table
        .insert(reviewsToInsert);

      if (reviewError) throw reviewError;

      // 3. All successful, move to unlock screen
      setStep('unlock');
    } catch (error) {
      console.error('Error submitting onboarding data:', error);
      alert('There was an error submitting your data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Render Helper ---
  const renderStep = () => {
    switch (step) {
      // --- STEP: WELCOME ---
      case 'welcome':
        return (
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Welcome to Spotly!</h1>
            <p className="text-lg mb-6">
              To unlock the best spots on campus, first share a couple of your
              favorites.
            </p>
            <button
              onClick={() => setStep('survey')}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all"
            >
              Get Started
            </button>
          </div>
        );

      // --- STEP: SURVEY ---
      case 'survey':
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-center">
              First, a few questions...
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep('promptStudy');
              }}
              className="space-y-6"
            >
              {/* Question 1 */}
              <div className="p-4 border rounded-lg">
                <p className="font-semibold mb-3">
                  I prefer study spots that are:
                </p>
                <div className="flex gap-4">
                  <label className="flex-1 p-4 border rounded-lg has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500 transition-all">
                    <input
                      type="radio"
                      name="studyPreference"
                      value="quiet"
                      onChange={handleSurveyChange}
                      required
                      className="mr-2"
                    />
                    🤫 Quiet
                  </label>
                  <label className="flex-1 p-4 border rounded-lg has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500 transition-all">
                    <input
                      type="radio"
                      name="studyPreference"
                      value="social"
                      onChange={handleSurveyChange}
                      required
                      className="mr-2"
                    />
                    🗣️ Social
                  </label>
                </div>
              </div>

              {/* Question 2 */}
              <div className="p-4 border rounded-lg">
                <p className="font-semibold mb-3">
                  The most important factor for a dining spot is:
                </p>
                <div className="flex gap-4">
                  <label className="flex-1 p-4 border rounded-lg has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500 transition-all">
                    <input
                      type="radio"
                      name="diningPreference"
                      value="quality"
                      onChange={handleSurveyChange}
                      required
                      className="mr-2"
                    />
                    ⭐ Quality
                  </label>
                  <label className="flex-1 p-4 border rounded-lg has-[:checked]:bg-blue-50 has-[:checked]:border-blue-500 transition-all">
                    <input
                      type="radio"
                      name="diningPreference"
                      value="value"
                      onChange={handleSurveyChange}
                      required
                      className="mr-2"
                    />
                    💰 Value
                  </label>
                </div>
              </div>
              
              {/* Add 1-3 more questions here following the same pattern */}

              <button
                type="submit"
                className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all"
              >
                Next
              </button>
            </form>
          </div>
        );
      
      // --- STEP: PROMPT 1 ---
      case 'promptStudy':
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6">
              First, what's your go-to study spot on campus?
            </h2>
            <p className="text-gray-600 mb-4">
              Think of that one place you can always count on to get work done.
            </p>
            <button
              onClick={() => setStep('reviewStudy')}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all"
            >
              I've got one!
            </button>
          </div>
        );

      // --- STEP: REVIEW 1 (Study) ---
      case 'reviewStudy':
        return (
          <ReviewForm
            title="Your Go-To Study Spot"
            reviewData={studyReview}
            onChange={handleStudyReviewChange}
            onSubmit={() => setStep('promptMeal')}
            isLoading={isLoading}
          />
        );

      // --- STEP: PROMPT 2 ---
      case 'promptMeal':
        return (
          <div className="text-center">
             <h2 className="text-2xl font-bold mb-6">
              Awesome, thanks! Now, what's your favorite place for a meal?
            </h2>
            <p className="text-gray-600 mb-4">
              On-campus or off-campus, where do you go for a great bite?
            </p>
            <button
              onClick={() => setStep('reviewMeal')}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all"
            >
              I know just the place
            </button>
          </div>
        );
      
      // --- STEP: REVIEW 2 (Meal) ---
      case 'reviewMeal':
        return (
          <ReviewForm
            title="Your Favorite Meal Spot"
            reviewData={mealReview}
            onChange={handleMealReviewChange}
            onSubmit={submitOnboardingData} // This is the FINAL submit
            isLoading={isLoading}
            submitText="Finish & Unlock Spotly"
          />
        );

      // --- STEP: UNLOCK ---
      case 'unlock':
        return (
          <div className="text-center">
            {/* You can add a fun animation here (e.g., Lottie) */}
            <div className="text-6xl mb-6">🎉</div> 
            <h1 className="text-3xl font-bold mb-4">You're in!</h1>
            <p className="text-lg mb-6">
              You've unlocked Spotly. Here's what other students are saying.
            </p>
            <button
              onClick={() => {
                // This updates the parent's state, which will cause
                // HomePage.tsx to re-render and show the <Dashboard />
                setProfile((prev: any) => ({ ...prev, is_onboarded: true }));
              }}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-all"
            >
              See All Spots
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl">
        {renderStep()}
      </div>
    </div>
  );
};

// --- Reusable Review Form Sub-Component ---
interface ReviewFormProps {
  title: string;
  reviewData: Omit<ReviewData, 'type'>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  isLoading: boolean;
  submitText?: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  title,
  reviewData,
  onChange,
  onSubmit,
  isLoading,
  submitText = 'Submit Review',
}) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-4"
    >
      <h2 className="text-2xl font-bold text-center">{title}</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Spot Name (e.g., "KSL 3rd Floor" or "Melt")
        </label>
        <input
          type="text"
          name="spotName"
          value={reviewData.spotName}
          onChange={onChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Quick Review (one sentence)
        </label>
        <textarea
          name="reviewText"
          value={reviewData.reviewText}
          onChange={onChange}
          required
          rows={2}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Rating (1 = Bad, 5 = Great)
        </label>
        <input
          type="range"
          name="rating"
          min="1"
          max="5"
          step="1"
          value={reviewData.rating}
          onChange={onChange}
          className="w-full"
        />
        <div className="text-center font-bold text-blue-600 text-lg">
          {reviewData.rating} Star{reviewData.rating > 1 ? 's' : ''}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Specific Spot (Optional)
        </label>
        <input
          type="text"
          name="specificSpot"
          value={reviewData.specificSpot}
          onChange={onChange}
          placeholder="e.g., 'The big table by the window'"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all disabled:bg-gray-400"
      >
        {isLoading ? 'Submitting...' : submitText}
      </button>
    </form>
  );
};

export default OnboardingFlow;



