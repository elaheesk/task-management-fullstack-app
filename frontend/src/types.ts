export interface ITasks {
    taskId: number;
    taskName: string;
    date: Date | string;
    ranktask: string;
    tagId: string;
    filename?: string;
    filetype?: string;
    filesize?: number;
    filepath?: string;

}
export interface FileMetadata {
    name: string;
    type: string;
    size: number;
    path: string;
}

export interface TaskCardProps {
    task: ITasks;
    getTaskToEdit?: (id: number) => Promise<void>;
    deleteTask?: (id: number) => Promise<void>;
}
export interface IValidations {
    name: (value: string) => {
        isValid: boolean;
        error: string;
    };
    date: (value: string) => {
        isValid: boolean;
        error: string;
    };
}
interface InputField {
    value: string;
    hasError: boolean;
    touched: boolean;
};
export interface IInputData {
    [key: string]: InputField;
};

