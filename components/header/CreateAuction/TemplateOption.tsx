import React, { FC } from 'react';

const TemplateOption: FC<TemplateOptionProps> = ({
  label,
  description,
  value,
  selectedTemplate,
  onTemplateSelect,
}) => {
  const isSelected = selectedTemplate === value;

  const handleTemplateSelect = () => {
    onTemplateSelect(value);
  };
  return (
    <div className="m-6">
      <div className="flex gap-5">
        <input
          type="radio"
          name="templateOption"
          value={value}
          checked={isSelected}
          onChange={handleTemplateSelect}
        />
        <label className="font-medium">{label}</label>
      </div>
      {description && (
        <p className="ml-[2.125rem] text-[0.85rem]">{description}</p>
      )}
    </div>
  );
};

type TemplateOptionProps = {
  label: string;
  description?: string;
  value: string;
  selectedTemplate: string;
  // eslint-disable-next-line no-unused-vars
  onTemplateSelect: (template: string) => void;
};

export default TemplateOption;
