# Todo App (React + TypeScript)

## 실행 방법

- Requirements: Node v18+, PNPM/NPM/Yarn
- Install:

```bash
cd apps/app && pnpm install
cd apps/server && pnpm install
```

- Dev:

```bash
cd apps/server && pnpm dev
cd apps/app && pnpm dev
```

- Test:

```bash
cd apps/app && pnpm test
```

## 기술 스택 & 선택 이유

- React, TypeScript, React Query for state management, Fetch API for HTTP
- 스타일링: Tailwind CSS
- Backend: Next.js API Routes

## 구조

- apps/app/src/
- components/
- hooks/
- api/
- types/todo.ts
- apps/server/src/
- app/api/todos/
- lib/

## 주요 설계/트레이드오프

- 완료 제약: 모든 참조 todo가 완료되어야 본 todo 완료 가능
- 삭제 정책: 참조받는 todo가 있을 경우 자동으로 참조 제거
- 페이지네이션: 클라이언트 사이드 페이지네이션

## 가산점 구현

- [x] 페이지네이션/무한 스크롤
- [x] API 연동
- [ ] 유닛 테스트

## 데모 계정/시연 방법

- 시연 시나리오: 생성 → 참조 추가 → 완료 제약 확인 → 수정/삭제 → 페이지네이션
