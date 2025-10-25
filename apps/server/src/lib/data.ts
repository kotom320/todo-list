type Todo = {
    id: number;
    text: string;
    completed: boolean;
    references: number[];
    createdAt: string;
    updatedAt: string;
};

// 공통 데이터 저장소
export const todos: Todo[] = [];

// 데이터 조작 함수들
export function addTodo(todo: typeof todos[0]) {
    todos.push(todo);
}

export function updateTodo(id: number, updates: Partial<typeof todos[0]>) {
    const index = todos.findIndex(todo => todo.id === id);
    if (index !== -1) {
        todos[index] = { ...todos[index], ...updates, updatedAt: new Date().toISOString() };
    }
}

export function deleteTodo(id: number) {
    // 참조 정리
    for (let i = 0; i < todos.length; i++) {
        todos[i] = {
            ...todos[i],
            references: todos[i].references.filter(ref => ref !== id)
        };
    }

    // 할 일 삭제
    const index = todos.findIndex(todo => todo.id === id);
    if (index !== -1) {
        todos.splice(index, 1);
    }
}
