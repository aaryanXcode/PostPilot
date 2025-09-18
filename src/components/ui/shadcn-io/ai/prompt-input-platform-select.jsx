import {
  PromptInputModelSelect,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
} from '@/components/ui/shadcn-io/ai/prompt-input';


const platforms = [
  { id: 'default' , name: 'default' },
  { id: 'instagram', name: 'Instagram' },
  { id: 'twitter', name: 'Twitter' },
  { id: 'facebook', name: 'Facebook' },
  { id: 'linkedin', name: 'LinkedIn' },
];

export function PromptInputPlatformSelect({ value, onValueChange, className }) {
  return (
    <PromptInputModelSelect value={value} onValueChange={onValueChange} className={className}>
      <PromptInputModelSelectTrigger>
        <PromptInputModelSelectValue placeholder="Select platform" />
      </PromptInputModelSelectTrigger>
      <PromptInputModelSelectContent>
        {platforms.map((platform) => (
          <PromptInputModelSelectItem key={platform.id} value={platform.id}>
            {platform.name}
          </PromptInputModelSelectItem>
        ))}
      </PromptInputModelSelectContent>
    </PromptInputModelSelect>
  );
}
