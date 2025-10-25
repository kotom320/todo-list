import { NextRequest, NextResponse } from 'next/server';

// 임시 데이터 저장소 (실제로는 데이터베이스 사용)
let todos = [
    {
        id: 1,
        text: "할 일 1",
        completed: false,
        references: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 2,
        text: "할 일 2",
        completed: false,
        references: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 3,
        text: "할 일 3",
        completed: false,
        references: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

// PUT /api/todos/[id] - 할 일 수정
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        const body = await request.json();
        const { text, completed, references } = body;

        const todoIndex = todos.findIndex(todo => todo.id === id);

        if (todoIndex === -1) {
            return NextResponse.json(
                { error: '할 일을 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        const updatedTodo = {
            ...todos[todoIndex],
            ...(text !== undefined && { text: text.trim() }),
            ...(completed !== undefined && { completed }),
            ...(references !== undefined && { references }),
            updatedAt: new Date().toISOString(),
        };

        todos[todoIndex] = updatedTodo;

        return NextResponse.json(updatedTodo);
    } catch (error) {
        return NextResponse.json(
            { error: '서버 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}

// DELETE /api/todos/[id] - 할 일 삭제
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);

        const todoIndex = todos.findIndex(todo => todo.id === id);

        if (todoIndex === -1) {
            return NextResponse.json(
                { error: '할 일을 찾을 수 없습니다.' },
                { status: 404 }
            );
        }

        // 참조 정리
        todos = todos.map(todo => ({
            ...todo,
            references: todo.references.filter(ref => ref !== id)
        }));

        // 할 일 삭제
        todos.splice(todoIndex, 1);

        return NextResponse.json({ message: '할 일이 삭제되었습니다.' });
    } catch (error) {
        return NextResponse.json(
            { error: '서버 오류가 발생했습니다.' },
            { status: 500 }
        );
    }
}
