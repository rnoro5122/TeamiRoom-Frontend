"""
인메모리 데이터베이스 모듈
실제 애플리케이션에서는 이 부분을 실제 데이터베이스(PostgreSQL, MongoDB 등)로 교체해야 합니다.
"""
from datetime import datetime
import uuid
from typing import Dict, List, Optional, Any

# 인메모리 데이터 저장소
db = {
    "promises": {},  # 약속 정보 저장
    "submissions": {},  # 약속서 제출 정보 저장
}

# 약속 관련 함수
def create_promise(promise_data: Dict[str, Any]) -> Dict[str, Any]:
    """새로운 약속 생성"""
    promise_id = f"{int(datetime.now().timestamp())}-{uuid.uuid4().hex[:8]}"
    
    promise = {
        "promiseId": promise_id,
        "promiseName": promise_data["promiseName"],
        "numberOfPeople": promise_data["numberOfPeople"],
        "promiseDate": promise_data["promiseDate"],
        "createdBy": promise_data.get("createdBy"),
        "createdAt": datetime.now(),
        "submissions": []
    }
    
    db["promises"][promise_id] = promise
    return promise

def get_promise(promise_id: str) -> Optional[Dict[str, Any]]:
    """약속 ID로 약속 정보 조회"""
    return db["promises"].get(promise_id)

def get_all_promises() -> List[Dict[str, Any]]:
    """모든 약속 목록 조회"""
    return list(db["promises"].values())

def delete_promise(promise_id: str) -> bool:
    """약속 삭제"""
    if promise_id in db["promises"]:
        del db["promises"][promise_id]
        # 해당 약속에 관련된 모든 제출도 삭제
        db["submissions"] = {
            sub_id: sub for sub_id, sub in db["submissions"].items() 
            if sub["promiseId"] != promise_id
        }
        return True
    return False

# 약속서 제출 관련 함수
def submit_promise(submission_data: Dict[str, Any]) -> Dict[str, Any]:
    """약속서 제출"""
    submission_id = f"sub_{uuid.uuid4().hex}"
    
    submission = {
        "submissionId": submission_id,
        "promiseId": submission_data["promiseId"],
        "userId": submission_data.get("userId", f"anonymous_{uuid.uuid4().hex[:8]}"),
        "preferences": submission_data["preferences"],
        "submittedAt": datetime.now()
    }
    
    db["submissions"][submission_id] = submission
    
    # 약속 정보에도 제출 정보 추가
    promise_id = submission_data["promiseId"]
    if promise_id in db["promises"]:
        if "submissions" not in db["promises"][promise_id]:
            db["promises"][promise_id]["submissions"] = []
        db["promises"][promise_id]["submissions"].append(submission_id)
    
    return submission

def get_submission(submission_id: str) -> Optional[Dict[str, Any]]:
    """제출 ID로 약속서 제출 정보 조회"""
    return db["submissions"].get(submission_id)

def get_submissions_by_promise(promise_id: str) -> List[Dict[str, Any]]:
    """약속 ID로 관련된 모든 약속서 제출 조회"""
    return [
        sub for sub in db["submissions"].values() 
        if sub["promiseId"] == promise_id
    ]

def update_submission(submission_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """약속서 제출 정보 수정"""
    if submission_id in db["submissions"]:
        db["submissions"][submission_id]["preferences"] = update_data["preferences"]
        return db["submissions"][submission_id]
    return None

def get_promise_status(promise_id: str) -> Optional[Dict[str, Any]]:
    """약속 현황 조회"""
    promise = get_promise(promise_id)
    if not promise:
        return None
    
    submissions = get_submissions_by_promise(promise_id)
    total_participants = int(promise["numberOfPeople"])
    submitted_count = len(submissions)
    
    participants = []
    submitted_users = set()
    
    # 제출한 사용자들 정보
    for sub in submissions:
        participants.append({
            "userId": sub["userId"],
            "name": None,  # 이름 정보는 없음 (인증 시스템 없음)
            "status": "submitted",
            "submittedAt": sub["submittedAt"]
        })
        submitted_users.add(sub["userId"])
    
    # 아직 제출하지 않은 참가자들 (더미 데이터)
    pending_count = total_participants - submitted_count
    for i in range(pending_count):
        participants.append({
            "userId": f"pending_user_{i}",
            "name": None,
            "status": "pending"
        })
    
    return {
        "promiseId": promise_id,
        "promiseName": promise["promiseName"],
        "totalParticipants": total_participants,
        "submittedCount": submitted_count,
        "pendingCount": pending_count,
        "participants": participants
    }

def generate_promise_results(promise_id: str) -> Optional[Dict[str, Any]]:
    """약속 결과 생성 (간단한 예시 구현)"""
    promise = get_promise(promise_id)
    if not promise:
        return None
    
    submissions = get_submissions_by_promise(promise_id)
    if not submissions:
        return None
    
    # 간단한 결과 처리 로직 (실제로는 더 복잡할 수 있음)
    food_preferences = {}
    activity_preferences = {}
    dress_code_preferences = {}
    
    for sub in submissions:
        prefs = sub["preferences"]
        
        # 음식 선호도 처리
        food = prefs["foodPreference"]
        food_preferences[food] = food_preferences.get(food, 0) + 1
        
        # 활동 선호도 처리
        activity = prefs["activityPreference"]
        activity_preferences[activity] = activity_preferences.get(activity, 0) + 1
        
        # 드레스 코드 선호도 처리
        dress = prefs["dressCodeLevel"]
        dress_code_preferences[dress] = dress_code_preferences.get(dress, 0) + 1
    
    # 가장 많이 선호된 항목들 추출
    recommended_food = sorted(food_preferences.items(), key=lambda x: x[1], reverse=True)
    recommended_activity = sorted(activity_preferences.items(), key=lambda x: x[1], reverse=True)
    recommended_dress = sorted(dress_code_preferences.items(), key=lambda x: x[1], reverse=True)
    
    return {
        "promiseId": promise_id,
        "promiseName": promise["promiseName"],
        "promiseDate": promise["promiseDate"],
        "recommendedOptions": {
            "food": [f"{food} ({count}표)" for food, count in recommended_food],
            "activity": [f"{activity} ({count}표)" for activity, count in recommended_activity],
            "dressCode": f"{recommended_dress[0][0]} ({recommended_dress[0][1]}표)" if recommended_dress else "정보 없음"
        },
        "generatedAt": datetime.now()
    }
