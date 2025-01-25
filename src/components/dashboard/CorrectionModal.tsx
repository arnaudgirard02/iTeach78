import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import CorrectionOption1 from './correction-options/CorrectionOption1';
import CorrectionOption2 from './correction-options/CorrectionOption2';
import CorrectionOption3 from './correction-options/CorrectionOption3';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CorrectionModal({ isOpen, onClose }: Props) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const options = [
    {
      id: 1,
      title: "J'ai déjà un exercice et un barème",
      description: "Uploadez vos copies pour une correction selon votre barème"
    },
    {
      id: 2,
      title: "J'ai un exercice mais pas de barème",
      description: "Notre IA vous propose un barème adapté"
    },
    {
      id: 3,
      title: "Je pars de zéro",
      description: "L'IA vous suggère des exercices et leurs barèmes"
    }
  ];

  const handleOptionSelect = (optionId: number) => {
    setSelectedOption(optionId);
  };

  const handleBack = () => {
    setSelectedOption(null);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Overlay className="fixed inset-0 bg-black/30" />

        <div className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full mx-auto p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>

          <Dialog.Title className="text-2xl font-bold text-gray-900 mb-6">
            {selectedOption ? options.find(opt => opt.id === selectedOption)?.title : "Nouveau projet de correction"}
          </Dialog.Title>

          <div className="mt-4">
            {selectedOption === null ? (
              <div className="grid md:grid-cols-3 gap-6">
                {options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleOptionSelect(option.id)}
                    className="text-left p-6 rounded-xl border-2 border-gray-200 hover:border-indigo-500 hover:shadow-md transition-all"
                  >
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {option.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {option.description}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <div>
                {selectedOption === 1 && <CorrectionOption1 onBack={handleBack} />}
                {selectedOption === 2 && <CorrectionOption2 onBack={handleBack} />}
                {selectedOption === 3 && <CorrectionOption3 onBack={handleBack} />}
              </div>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
}