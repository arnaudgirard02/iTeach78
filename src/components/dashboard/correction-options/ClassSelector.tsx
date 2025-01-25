import React from 'react';

const CLASS_LEVELS = [
  { id: '6eme', label: '6ème' },
  { id: '5eme', label: '5ème' },
  { id: '4eme', label: '4ème' },
  { id: '3eme', label: '3ème' },
  { id: '2nde', label: 'Seconde' },
  { id: '1ere', label: 'Première' },
  { id: 'terminale', label: 'Terminale' }
];

interface Props {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export default function ClassSelector({ value, onChange, className = '' }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${className}`}
    >
      <option value="">Sélectionnez une classe</option>
      {CLASS_LEVELS.map((level) => (
        <option key={level.id} value={level.id}>
          {level.label}
        </option>
      ))}
    </select>
  );
}