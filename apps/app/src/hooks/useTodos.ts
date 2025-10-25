import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { todoApi } from '../api/todoApi';
import type { Todo } from '../types/todo';

// Query Keys
export const todoKeys = {
    all: ['todos'] as const,
    lists: () => [...todoKeys.all, 'list'] as const,
};

// 모든 할 일 조회
export function useTodos() {
    return useQuery<Todo[]>({
        queryKey: todoKeys.lists(),
        queryFn: todoApi.getAllTodos,
    });
}

// 생성
export function useCreateTodo() {
    const queryClient = useQueryClient();

    return useMutation<Todo, Error, { text: string; references?: number[] }>({
        mutationFn: ({ text, references }) =>
            todoApi.createTodo(text, references),
        onSuccess: () => {
            // 할 일 목록 새로고침
            queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
        },
    });
}

// 수정
export function useUpdateTodo() {
    const queryClient = useQueryClient();

    return useMutation<Todo, Error, { id: number; updates: Partial<Pick<Todo, 'text' | 'completed' | 'references'>> }>({
        mutationFn: ({ id, updates }) =>
            todoApi.updateTodo(id, updates),
        onSuccess: () => {
            // 할 일 목록 새로고침
            queryClient.invalidateQueries({ queryKey: todoKeys.lists() });

        },
    });
}

// 삭제
export function useDeleteTodo() {
    const queryClient = useQueryClient();

    return useMutation<void, Error, number>({
        mutationFn: (id) => todoApi.deleteTodo(id),
        onSuccess: () => {
            // 할 일 목록 새로고침
            queryClient.invalidateQueries({ queryKey: todoKeys.lists() });

        },
    });
}
