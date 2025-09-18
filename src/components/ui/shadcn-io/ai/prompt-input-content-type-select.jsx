import {
  PromptInputModelSelect,
  PromptInputModelSelectTrigger,
  PromptInputModelSelectValue,
  PromptInputModelSelectContent,
  PromptInputModelSelectItem,
} from '@/components/ui/shadcn-io/ai/prompt-input';

const contentTypes = [
  { id: 'TEXT', name: 'Text' },
  { id: 'IMAGE', name: 'Image' },
  { id: 'VIDEO', name: 'Video' },
  { id: 'POST', name: 'Post' },
  { id: 'STORY', name: 'Story' },
  { id: 'ARTICLE', name: 'Article' },
  { id: 'THREAD', name: 'Thread' },
  { id: 'CAROUSEL', name: 'Carousel' },
  { id: 'VIDEO_SCRIPT', name: 'Video Script' },
  { id: 'BLOG_POST', name: 'Blog Post' },
];

export function PromptInputContentTypeSelect({ value, onValueChange, className }) {
  return (
    <PromptInputModelSelect value={value} onValueChange={onValueChange} className={className}>
      <PromptInputModelSelectTrigger>
        <PromptInputModelSelectValue placeholder="Select content type" />
      </PromptInputModelSelectTrigger>
      <PromptInputModelSelectContent>
        {contentTypes.map((type) => (
          <PromptInputModelSelectItem key={type.id} value={type.id}>
            {type.name}
          </PromptInputModelSelectItem>
        ))}
      </PromptInputModelSelectContent>
    </PromptInputModelSelect>
  );
}
