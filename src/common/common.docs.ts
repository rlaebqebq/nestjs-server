export class CommonApiDocs {
  static CreateOperation() {
    return {
      summary: '생성 (권한 필요)',
    };
  }

  static UploadOperation() {
    return {
      summary: '파일업로드 (권한 필요)',
    };
  }

  static FindAllOperation() {
    return {
      summary: '전체 목록 조회',
    };
  }

  static SearchOperation() {
    return {
      summary: '목록 검색',
    };
  }

  static FindOneOperation() {
    return {
      summary: '상세 정보 조회',
    };
  }

  static FindFileOneOperation() {
    return {
      summary: '파일 조회',
    };
  }

  static EditOperation() {
    return {
      summary: '정보 수정 (권한 필요)',
    };
  }

  static DeleteOperation() {
    return {
      summary: '삭제 (권한 필요)',
    };
  }
}
