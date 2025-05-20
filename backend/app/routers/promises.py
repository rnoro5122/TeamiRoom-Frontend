from fastapi import APIRouter, HTTPException, status
from ..models import database as db
from ..models.promise import (
    PromiseCreate, 
    PromiseResponse,
    PromiseSubmission,
    SubmissionResponse,
    PromiseInfo, 
    PromiseDetailResponse,
    PromiseStatusResponse,
    PromiseResultsResponse,
    SubmissionUpdate
)
from typing import List

router = APIRouter()

@router.post("/promises/create", response_model=PromiseResponse)
async def create_promise(promise: PromiseCreate):
    """새로운 약속 생성"""
    try:
        result = db.create_promise(promise.model_dump())
        
        # 응답 생성
        return {
            "success": True,
            "promiseId": result["promiseId"],
            "shareLink": f"/promise/{result['promiseId']}"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"약속 생성 중 오류가 발생했습니다: {str(e)}"
        )

@router.get("/promises/{promise_id}", response_model=PromiseDetailResponse)
async def get_promise(promise_id: str):
    """약속 정보 조회"""
    promise = db.get_promise(promise_id)
    if not promise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="약속을 찾을 수 없습니다."
        )
    
    # 제출 정보 조회
    submissions = db.get_submissions_by_promise(promise_id)
    
    # 응답 구성
    return {
        "promiseId": promise["promiseId"],
        "promiseName": promise["promiseName"],
        "numberOfPeople": promise["numberOfPeople"],
        "promiseDate": promise["promiseDate"],
        "createdAt": promise["createdAt"],
        "submissions": submissions
    }

@router.post("/promises/submit", response_model=SubmissionResponse)
async def submit_promise(submission: PromiseSubmission):
    """약속서 제출"""
    # 약속 존재 여부 확인
    promise = db.get_promise(submission.promiseId)
    if not promise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="약속을 찾을 수 없습니다."
        )
    
    try:
        result = db.submit_promise(submission.model_dump())
        return {
            "success": True,
            "submissionId": result["submissionId"],
            "message": "약속서가 성공적으로 제출되었습니다."
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"약속서 제출 중 오류가 발생했습니다: {str(e)}"
        )

@router.get("/promises/{promise_id}/status", response_model=PromiseStatusResponse)
async def get_promise_status(promise_id: str):
    """약속 현황 조회"""
    status = db.get_promise_status(promise_id)
    if not status:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="약속을 찾을 수 없습니다."
        )
    
    return status

@router.get("/promises/{promise_id}/results", response_model=PromiseResultsResponse)
async def get_promise_results(promise_id: str):
    """약속 결과 조회"""
    # 약속 존재 여부 확인
    promise = db.get_promise(promise_id)
    if not promise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="약속을 찾을 수 없습니다."
        )
    
    # 결과 생성
    results = db.generate_promise_results(promise_id)
    if not results:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="약속 결과를 생성할 수 없습니다. 제출된 약속서가 없습니다."
        )
    
    return results

@router.put("/promises/submissions/{submission_id}", response_model=SubmissionResponse)
async def update_submission(submission_id: str, update_data: SubmissionUpdate):
    """약속서 수정"""
    updated = db.update_submission(submission_id, update_data.model_dump())
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="약속서를 찾을 수 없습니다."
        )
    
    return {
        "success": True,
        "submissionId": updated["submissionId"],
        "message": "약속서가 성공적으로 수정되었습니다."
    }

@router.delete("/promises/{promise_id}", response_model=dict)
async def delete_promise(promise_id: str):
    """약속 삭제"""
    # 약속 존재 여부 확인
    promise = db.get_promise(promise_id)
    if not promise:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="약속을 찾을 수 없습니다."
        )
    
    # 약속 삭제
    deleted = db.delete_promise(promise_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="약속 삭제 중 오류가 발생했습니다."
        )
    
    return {
        "success": True,
        "message": "약속이 성공적으로 삭제되었습니다."
    }
