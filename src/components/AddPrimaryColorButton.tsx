interface AddPrimaryColorButtonProps {
  onClick: () => void;
}

export function AddPrimaryColorButton({ onClick }: AddPrimaryColorButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full lg:w-auto rounded-full bg-stone-100 px-3 py-2 lg:px-4 lg:py-2 text-base font-medium text-stone-700 hover:bg-stone-200"
    >
      Добавить основной цвет
    </button>
  );
}
