import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface ConsentDialogProps {
  open: boolean;
  onConsent: (agreed: boolean) => void;
}

export function ConsentDialog({ open, onConsent }: ConsentDialogProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleDecline = () => {
    setShowConfirmation(true);
  };

  const handleFinalDecline = () => {
    setShowConfirmation(false);
    onConsent(false);
  };

  const handleAccept = () => {
    onConsent(true);
  };

  if (showConfirmation) {
    return (
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              By declining access to your academic data, you will not be able
              to:
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-3">
            <ul className="list-disc list-inside space-y-1 text-red-600">
              <li>View your personalized score dashboard</li>
              <li>Receive AI-powered analysis of your academic performance</li>
              <li>Access the automatic tutor matching system</li>
              <li>Get recommendations for subjects that need improvement</li>
            </ul>
            <p className="text-sm text-gray-700">
              This will significantly limit the system's ability to help you
              succeed in your studies.
            </p>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConfirmation(false)}>
              Go Back
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleFinalDecline}
              className="bg-red-600 hover:bg-red-700"
            >
              I Understand, Decline Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Academic Data Access Permission</AlertDialogTitle>
          <AlertDialogDescription>
            Will you agree for this project to access your academic data?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-3">
          <p className="text-sm text-gray-700">This will allow us to:</p>
          <ul className="list-disc list-inside space-y-1 text-blue-700 text-sm">
            <li>Display your course scores and performance metrics</li>
            <li>Analyze subjects where you might need additional support</li>
            <li>Automatically match you with suitable tutors</li>
            <li>Provide personalized learning recommendations</li>
          </ul>
          <p className="text-sm text-gray-600">
            Your data will only be used within the HCMUT Peer Tutoring System
            and will not be shared with third parties.
          </p>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleDecline}>
            No, Decline
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleAccept}>
            Yes, I Agree
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
