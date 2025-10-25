import { addCorsHeaders, } from '@/lib/cors';
import { addTodo, todos } from '@/lib/data';
import { NextRequest, NextResponse } from 'next/server';



// GET /api/todos - 모든 할 일 조회
export async function GET() {
    const response = NextResponse.json(todos);
    return addCorsHeaders(response);
}

// POST /api/todos - 새 할 일 생성
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { text, references = [] } = body;

        if (!text || text.trim() === '') {
            const response = NextResponse.json(
                { error: '할 일 내용은 필수입니다.' },
                { status: 400 }
            );
            return addCorsHeaders(response);
        }

        // 새로운 ID 생성 (현재 최대 ID + 1)
        const maxId = todos.length > 0 ? Math.max(...todos.map(todo => todo.id)) : 0;
        const newId = maxId + 1;

        const newTodo = {
            id: newId,
            text: text.trim(),
            completed: false,
            references,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        addTodo(newTodo);

        const response = NextResponse.json(newTodo, { status: 201 });
        return addCorsHeaders(response);
    } catch (error) {
        const response = NextResponse.json(
            { error: '서버 오류가 발생했습니다.' },
            { status: 500 }
        );
        return addCorsHeaders(response);
    }
}
