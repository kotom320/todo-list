export type Todo = {
    id: number;
    text: string;
    completed: boolean;
    references: number[];
    createdAt: string;
    updatedAt: string;
};

export const TodoFilter = {
    ALL: "all",
    ACTIVE: "active",
    COMPLETED: "completed"
} as const;

export type TodoFilter = typeof TodoFilter[keyof typeof TodoFilter];
