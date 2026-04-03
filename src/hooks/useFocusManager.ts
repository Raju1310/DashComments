import { useState, useCallback } from 'react';

export const useFocusManager = (initialFieldIds: string[] = []) => {
  const [fieldIds, setFieldIds] = useState<string[]>(initialFieldIds);
  const [activeFieldId, setActiveFieldId] = useState<string | null>(initialFieldIds.length > 0 ? initialFieldIds[0] : null);

  const focusNext = useCallback(() => {
    if (!activeFieldId) return false;
    const currentIndex = fieldIds.indexOf(activeFieldId);
    if (currentIndex < fieldIds.length - 1) {
      const nextId = fieldIds[currentIndex + 1];
      setActiveFieldId(nextId);
      document.getElementById(nextId)?.focus();
      return true;
    }
    return false; // Last field
  }, [activeFieldId, fieldIds]);

  const focusPrevious = useCallback(() => {
    if (!activeFieldId) return false;
    const currentIndex = fieldIds.indexOf(activeFieldId);
    if (currentIndex > 0) {
      const prevId = fieldIds[currentIndex - 1];
      setActiveFieldId(prevId);
      document.getElementById(prevId)?.focus();
      return true;
    }
    return false; // First field
  }, [activeFieldId, fieldIds]);

  const setFocus = useCallback((id: string) => {
    if (fieldIds.includes(id)) {
      setActiveFieldId(id);
      document.getElementById(id)?.focus();
    }
  }, [fieldIds]);

  return {
    activeFieldId,
    focusNext,
    focusPrevious,
    setFocus,
    setFieldIds,
    fieldIds
  };
};
