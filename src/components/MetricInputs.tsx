import React from 'react';

interface ScoreMetricProps {
  label: string;
  value: number;
  max: number;
  onChange: (value: number) => void;
  description?: string;
}

export const ScoreMetric: React.FC<ScoreMetricProps> = ({
  label,
  value,
  max,
  onChange,
  description,
}) => {
  return (
    <div className="mb-4 p-4 border border-gray-300 rounded-lg bg-white">
      <div className="flex justify-between items-center mb-2">
        <label className="font-semibold text-gray-700">{label}</label>
        <span className="text-sm text-gray-600">
          {value} / {max}
        </span>
      </div>
      {description && <p className="text-sm text-gray-500 mb-3">{description}</p>}
      <input
        type="range"
        min="0"
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>0</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

interface CheckboxMetricProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  points: number;
  description?: string;
}

export const CheckboxMetric: React.FC<CheckboxMetricProps> = ({
  label,
  checked,
  onChange,
  points,
  description,
}) => {
  return (
    <div className="mb-4 p-4 border border-gray-300 rounded-lg bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 cursor-pointer"
          />
          <label className="ml-3 font-semibold text-gray-700 cursor-pointer">
            {label}
          </label>
        </div>
        <span className="text-sm font-semibold text-blue-600">
          {checked ? `+${points}` : '+0'} pts
        </span>
      </div>
      {description && <p className="text-sm text-gray-500 mt-2">{description}</p>}
    </div>
  );
};

interface SelectMetricProps {
  label: string;
  value: string;
  options: { label: string; value: string; points: number }[];
  onChange: (value: string) => void;
  description?: string;
}

export const SelectMetric: React.FC<SelectMetricProps> = ({
  label,
  value,
  options,
  onChange,
  description,
}) => {
  const currentPoints =
    options.find((opt) => opt.value === value)?.points || 0;

  return (
    <div className="mb-4 p-4 border border-gray-300 rounded-lg bg-white">
      <div className="flex justify-between items-center mb-2">
        <label className="font-semibold text-gray-700">{label}</label>
        <span className="text-sm font-semibold text-blue-600">{currentPoints} pts</span>
      </div>
      {description && <p className="text-sm text-gray-500 mb-3">{description}</p>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
