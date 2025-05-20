# TeamIRoom Backend API

TeamIRoom 약속 서비스의 백엔드 API입니다. FastAPI를 사용하여 구현되었습니다.

## 설치 방법

1. Python 3.8 이상이 필요합니다.

2. 필요한 패키지 설치:

```bash
pip install -r requirements.txt
```

## 실행 방법

다음 명령어로 서버를 실행합니다:

```bash
python main.py
```

서버가 실행되면 다음 주소에서 API 문서를 볼 수 있습니다:

- API 문서: http://localhost:8000/docs
- 대체 API 문서: http://localhost:8000/redoc

## API 엔드포인트

### 약속 관련

- `POST /api/promises/create`: 새로운 약속 생성
- `GET /api/promises/{promise_id}`: 약속 정보 조회
- `DELETE /api/promises/{promise_id}`: 약속 삭제
- `GET /api/promises/{promise_id}/status`: 약속 현황 조회
- `GET /api/promises/{promise_id}/results`: 약속 결과 조회

### 약속서 관련

- `POST /api/promises/submit`: 약속서 제출
- `PUT /api/promises/submissions/{submission_id}`: 약속서 수정

## 참고 사항

- 현재는 인메모리 데이터베이스를 사용하므로 서버를 재시작하면 모든 데이터가 초기화됩니다.
- 사용자 인증 및 권한 관리 기능은 구현되어 있지 않습니다.
