from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import promises

app = FastAPI(
    title="TeamIRoom API",
    description="API for TeamIRoom promise management application",
    version="0.1.0",
)

# CORS 설정 - 프론트엔드와 통신하기 위해 필요
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 프로덕션에서는 특정 오리진으로 제한해야 함
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(promises.router, prefix="/api", tags=["promises"])

@app.get("/")
async def root():
    return {"message": "TeamIRoom API에 오신 것을 환영합니다!"}
