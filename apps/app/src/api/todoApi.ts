import type { Todo } from '../types/todo';

const API_BASE_URL = 'http://localhost:3001/api';


export const todoApi = {
    // 조회
    async getAllTodos(): Promise<Todo[]> {
        const response = await fetch(`${API_BASE_URL}/todos`);
        if (!response.ok) {
            throw new Error('할 일을 불러오는데 실패했습니다.');
        }
        return response.json();
    },

    // 생성
    async createTodo(text: string, references: number[] = []): Promise<Todo> {
        const response = await fetch(`${API_BASE_URL}/todos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text, references }),
        });
        if (!response.ok) {
            throw new Error('할 일을 생성하는데 실패했습니다.');
        }
        return response.json();
    },

    // 수정
    async updateTodo(id: number, updates: Partial<Pick<Todo, 'text' | 'completed' | 'references'>>): Promise<Todo> {
        const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates),
        });
        if (!response.ok) {
            throw new Error('할 일을 수정하는데 실패했습니다.');
        }
        return response.json();
    },

    // 삭제
    async deleteTodo(id: number): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/todos/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('할 일을 삭제하는데 실패했습니다.');
        }
    },
};
