/**
 * 샘플 사용자 데이터 타입
 */
export interface SampleUser {
  id: number
  name: string
  email: string
  status: string
}

/**
 * 샘플 사용자 데이터
 *
 * 마스터 테이블에 표시될 샘플 데이터입니다.
 */
export const sampleUsers: SampleUser[] = [
  { id: 1, name: '홍길동', email: 'hong@example.com', status: '활성' },
  { id: 2, name: '김철수', email: 'kim@example.com', status: '활성' },
  { id: 3, name: '이영희', email: 'lee@example.com', status: '비활성' },
  { id: 4, name: '박민수', email: 'park@example.com', status: '활성' },
  { id: 5, name: '최지우', email: 'choi@example.com', status: '활성' },
  { id: 6, name: '정수진', email: 'jung@example.com', status: '비활성' },
  { id: 7, name: '강동원', email: 'kang@example.com', status: '활성' },
  { id: 8, name: '송중기', email: 'song@example.com', status: '활성' },
  { id: 9, name: '전지현', email: 'jun@example.com', status: '활성' },
  { id: 10, name: '김태희', email: 'kimth@example.com', status: '비활성' },
]
