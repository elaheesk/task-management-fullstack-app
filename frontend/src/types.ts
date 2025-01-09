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