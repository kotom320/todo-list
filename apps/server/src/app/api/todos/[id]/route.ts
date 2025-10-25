import { addCorsHeaders } from '@/lib/cors';
import { deleteTodo, todos, updateTodo } from '@/lib/data';
import { NextRequest, NextResponse } from 'next/server';



// PUT /api/todos/[id] - 할 일 수정
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idParam } = await params;
        const id = parseInt(idParam);
        const body = await request.json();
        const { text, completed, references } = body;
        const todoIndex = todos.findIndex(todo => todo.id === id);

        if (todoIndex === -1) {
            const response = NextResponse.json(
                { error: '할 일을 찾을 수 없습니다.' },
                { status: 404 }
            );
            return addCorsHeaders(response);
        }

        const updates: any = {};
        if (text !== undefined) updates.text = text.trim();
        if (completed !== undefined) updates.completed = completed;
        if (references !== undefined) updates.references = references;

        updateTodo(id, updates);
        const updatedTodo = todos.find(todo => todo.id === id);

        const response = NextResponse.json(updatedTodo);
        return addCorsHeaders(response);
    } catch (error) {
        const response = NextResponse.json(
            { error: '서버 오류가 발생했습니다.' },
            { status: 500 }
        );
        return addCorsHeaders(response);
    }
}

// DELETE /api/todos/[id] - 할 일 삭제
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idParam } = await params;
        const id = parseInt(idParam);

        const todoIndex = todos.findIndex(todo => todo.id === id);

        if (todoIndex === -1) {
            const response = NextResponse.json(
                { error: '할 일을 찾을 수 없습니다.' },
                { status: 404 }
            );
            return addCorsHeaders(response);
        }

        deleteTodo(id);

        const response = NextResponse.json({ message: '할 일이 삭제되었습니다.' });
        return addCorsHeaders(response);
    } catch (error) {
        const response = NextResponse.json(
            { error: '서버 오류가 발생했습니다.' },
            { status: 500 }
        );
        return addCorsHeaders(response);
    }
}
