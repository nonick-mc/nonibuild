'use client';

import {
  EmojiPicker,
  EmojiPickerGroup,
  EmojiPickerHeader,
  EmojiPickerInput,
  EmojiPickerList,
} from '../ui/emoji-picker';

type UnicodeEmojiPickerProps = {
  onEmojiSelect?: (emoji: string) => void;
};

export function UnicodeEmojiPicker({ onEmojiSelect }: UnicodeEmojiPickerProps) {
  return (
    <EmojiPicker emojisPerRow={9} emojiSize={32} onEmojiSelect={onEmojiSelect}>
      <EmojiPickerHeader>
        <EmojiPickerInput />
      </EmojiPickerHeader>
      <EmojiPickerGroup>
        <EmojiPickerList />
      </EmojiPickerGroup>
    </EmojiPicker>
  );
}
