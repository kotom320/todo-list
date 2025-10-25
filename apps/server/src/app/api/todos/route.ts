import { NextRequest, NextResponse } from 'next/server';

// 임시 데이터 저장소 (실제로는 데이터베이스 사용)
const todos = [
    {
        id: 1,
        text: "서버 할 일 1",
        completed: false,
        references: [2, 3],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 2,
        text: "서버 할 일 2",
        completed: false,
        references: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 3,
        text: "서버 할 일 3",
        completed: false,
        references: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

// GET /api/todos - 모든 할 일 조회
export async function GET() {
    return NextResponse.json(todos);
}

// POST /api/todos - 새 할 일 생성
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { text, } = body;

        if (!text || text.trim() === '') {
            return NextResponse.json(
                { error: '할 일 내용은 필수입니다.' },
                { status: 400 }
            );
        }

        // 새로운 ID 생성 (현재 최대 ID + 1)
        const maxId = todos.length > 0 ? Math.max(...todos.map(todo => todo.id)) : 0;
        const newId = maxId + 1;

        const newTodo = {
            id: newId,
            text: text.trim(),
            completed: false,
            references: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        todos.push(newTodo);

        return NextResponse.json(newTodo, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: '서버 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
