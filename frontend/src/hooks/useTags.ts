import { useEffect } from "react";

export const useTags = (
    tagCheckBoxes: { workTagIdIsChecked: boolean; personalTagIdIsChecked: boolean },
    setTags: (tags: { work: string; personal: string }) => void
) => {
    useEffect(() => {
        setTags({
            work: tagCheckBoxes.workTagIdIsChecked ? "1" : "",
            personal: tagCheckBoxes.personalTagIdIsChecked ? "2" : "",
        });
    }, [tagCheckBoxes.workTagIdIsChecked, tagCheckBoxes.personalTagIdIsChecked, setTags]);
};
