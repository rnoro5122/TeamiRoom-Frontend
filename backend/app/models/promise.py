from pydantic import BaseModel, Field
from typing import List, Dict, Optional
from datetime import datetime
import uuid

class PromiseBase(BaseModel):
    """약속 기본 모델"""
    promiseName: str
    numberOfPeople: str
    promiseDate: datetime

class PromiseCreate(PromiseBase):
    """약속 생성 요청 모델"""
    createdBy: Optional[str] = None

class PromiseInfo(PromiseBase):
    """클라이언트에 보내는 약속 정보 모델"""
    promiseId: str
    createdAt: datetime

class PreferencesBase(BaseModel):
    """약속서 선호도 기본 모델"""
    foodPreference: str
    activityPreference: str
    dressCodeLevel: str

class PromiseSubmission(BaseModel):
    """약속서 제출 요청 모델"""
    promiseId: str
    userId: Optional[str] = None
    promiseInfo: Optional[PromiseBase] = None
    preferences: PreferencesBase

class SubmissionResponse(BaseModel):
    """약속서 제출 응답 모델"""
    success: bool
    submissionId: str
    message: str

class PromiseResponse(BaseModel):
    """약속 생성 응답 모델"""
    success: bool
    promiseId: str
    shareLink: str

class ParticipantStatus(BaseModel):
    """참가자 상태 모델"""
    userId: str
    name: Optional[str] = None
    status: str  # "submitted" or "pending"
    submittedAt: Optional[datetime] = None

class PromiseStatusResponse(BaseModel):
    """약속 현황 응답 모델"""
    promiseId: str
    promiseName: str
    totalParticipants: int
    submittedCount: int
    pendingCount: int
    participants: List[ParticipantStatus]

class RecommendedOptions(BaseModel):
    """추천 옵션 모델"""
    food: List[str]
    activity: List[str]
    dressCode: str

class PromiseResultsResponse(BaseModel):
    """약속 결과 응답 모델"""
    promiseId: str
    promiseName: str
    promiseDate: datetime
    recommendedOptions: RecommendedOptions
    generatedAt: datetime

class SubmissionInfo(BaseModel):
    """제출 정보 모델"""
    submissionId: str
    userId: str
    preferences: PreferencesBase
    submittedAt: datetime

class PromiseDetailResponse(BaseModel):
    """약속 상세 정보 응답 모델"""
    promiseId: str
    promiseName: str
    numberOfPeople: str
    promiseDate: datetime
    createdAt: datetime
    submissions: List[SubmissionInfo]

# 약속서 수정 요청 모델
class SubmissionUpdate(BaseModel):
    preferences: PreferencesBase
