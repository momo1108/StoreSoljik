- vercel 에서 기능 테스트 해봐야됨.
- vercel 에서 소셜 로그인 unauthorized domain 에러 뜸....
- useInfiniteQuery 의 pageParam 타입설정 관련 코드 리팩토링 필요
- Detail 페이지 이미지 클릭 시 상세보기 구현
- 로그인 후 창 닫고 세션만료시간 지난 후 재접속시 로그아웃 되는지 확인 필요 O
- Detail 페이지에서 추천 상품을 클리해서 이동해도 추천 목록이 업데이트 되지 않는 이슈 발견 O (useQuery 의 select 옵션을 활용해 필터링하도록 수정)
- 써드파티 로그인 기능의 세션 유지 기능 구현(React hook form 의 getValues 메서드를 활용) O
- 상품 구매 후 바로 구매이력 들어가면 구매한 상품이 업데이트가 안됨 O (queryClient 의 invalidateQueries 메서드에 await 사용해서 해결)
- Detail 페이지 렌더링 최적화 필요. O
    - 채팅창의 렌더링 별개 적용?
    - 수량 조정 시 전체가 리렌더링됨
- 장바구니 렌더링 최적화 필요
    - 수량 조정 시 전체가 리렌더링됨
    - 헤더 전체가 아닌 장바구니 버튼이랑만 연동하기
- Purchase 페이지 렌더링 최적화 필요
    - 배송 정보 입력값 수정, 장바구니 수정 시 전체가 리렌더링됨
    - 구매버튼 눌러도 전체 리렌더링
- Management 페이지도 주문 상태 변경 시 전체 리렌더링되는데 최적화 가능?
- 로그아웃 후 다른계정 로그인 시 react query 에 저장된 이전 계정의 데이터가 재활용되는 이슈 발견. 로그아웃 시 `queryClient.clear()` 로 초기화해야할듯. O
- 무한 스크롤 적용 시 렌더링 최적화 필요할듯. 모든 컴포넌트가 리렌더링 되는 상황인 것 같다.(Category, History - 훅도 분리했음, Items, Management) O
- theme 에 추가한 box-shadow 를 모든 컴포넌트에 적용하도록 수정 O
- CRUD 작업에 대해 toast 를 사용하는 경우, toast.promise 메서드로 통일해야 할 필요가 있다.(특히 상품 삭제) O
    - 라이브러리에서 제공되는 특수한 형태의 메서드들의 경우 적용하기가 애매한 경우가 많아서 일부만 적용
- 헤더에 구매자/판매자 페이지 네비게이션 추가하기 O
- 링크로 새 창을 열면 그 창은 로그인 페이지로 이동되는 문제를 발견 O
- 써드파티를 구현 중 회원 관리 방식의 리팩토링이 필요하다 판단 O
    - 기존의 회원 정보는 firebase 자체의 인증 정보 뿐 아니라 서비스 내에서 저장하고 사용할 계정 정보를 따로 DB에 저장함
    - 초기 프로젝트 구조에서는 firebase 외적으로 저장해야할 정보가 닉네임 혹은 계정 권한 구분(판매자/구매자)뿐이었음
    - 같은 이메일임에도 불구하고 구매자/판매자 계정을 따로 가입하는 것의 불편함과, firebase 인증 기능의 계정 식별자의 대부분이 이메일인 점을 고려하여 구조를 바꾸기로 결정
    - 한 계정으로 판매자 / 구매자 페이지 모두 접근 가능하도록 설계
    - 헤더에 판매자 / 구매자 페이지로의 네비게이션 ui 추가 필요
    - 추후 이메일 혹은 전화번호 인증을 통해서만 판매자 기능을 사용하도록 추가해도 좋을듯
    - 그에따른 기존 프로젝트의 코드 / 기존 데이터들의 리팩토링 필요
        - 이제 회원의 식별자로서 email 이 아닌 uid 를 사용해야한다. O
        - email 로 필터링하는 코드를 uid 로 변경해야함 (product fetch) O
        - email 필드를 참조하는 기능들도 리팩토링 후 확인 필요(toss payment) O 따로 배송 이메일을 입력받아서 처리하는 로직이기 때문에 영향 없음.
        - email 값을 가공해 저장되는 로직의 변경과 이미 저장된 필드들도 변경 필요(purchase product - batchOrderId) O
        - cart 관련 구조도 리팩토링이 필요. O
        - 마지막으로 email 필드를 전체적으로로 삭제해야함. O

- 써드파티 로그인 시 회원가입 프로세스에서 firebase 의 인증 서비스 뿐 아니라 DB 에 등록되는 과정도 수정이 필요
    - 써드파티의 경우 email 인증이 안된 아이디는 따로 이메일이 제공이 안되므로 처리작업이 필요하다.
    - 그냥 계정 DB에서 이메일 필드를 삭제하고 uid 로 유저 구분하는 방식도 고려해볼만 하다.
    - 혹은 이메일 필드를 nullable 한 필드로 두고 유저 식별은 uid 로만 진행하는 방식도 좋은듯
        - email 로 필터링하는 코드를 uid 로 변경해야함 (product fetch)
        - email 필드를 참조하는 기능들도 리팩토링 후 확인 필요(toss payment)
        - email 값을 가공해 저장되는 로직의 변경과 이미 저장된 필드들도 변경 필요(purchase product - batchOrderId)
- 이미지 리사이징 적용 후 성능 비교, 다른 최적화 적용
- ~~이미지 화질을 png로 리사이징하면 달라질까? => 현재 canvas 방식으로는 안달라진다... 심지어 quality 옵션을 1로 줘도 용량만 더 커지고 딱히 화질질은 안좋아짐~~
    - ~~refactor 스크립트에서는 기존 어플리케이션의 리사이징 메서드를 사용 불가. node.js 환경이라 Image 객체와 Canvas 객체가 없고, 이를 위해서 라이브러리를 설치안하면 구현하기 너무 힘듬~~
- 이미지가 원본부터 작은 경우, 리사이징 시 용량이 더 커지는 경우가 발견됨(300px * 165px 이쁜이 고양이들 이미지)
- 파비콘
- 구매 직후 실시간 채팅 메세지 작성 시 헤더가 다시 구매자로 출력될 필요가 있음
- 장바구니 DB로?
- 채팅 길이, 속도 제한?
- 채팅 기록을 전체를 다 불러올것인지, 최근 몇개 or 무한 스크롤? 
- ~~채팅기능 타임라인 표시하기~~
- ~~rollback Batch 말고 Single 도 만들기~~
- ~~rollbackUnfinished 기능의 경우, 모든 order 레코드 조회 후 각각 single rollback 으로 수행해야 할듯~~
- rollback 기능들 orderService 로 옮기는게 맞나?
- 구매 내역에서 데이터를 10개씩 잘라오면 같은 주문이라도 짤릴 가능성이 존재한다. 같은 주문은 잘리지 않게 다른 방식으로 잘라오는게 좋을듯?
- Registration, Update 컴포넌트의 스타일을 다른 페이지랑 통일 - container 로 감싸주기
- 타이틀 컴포넌트 만들기
- VerticalSelect 컴포넌트의 StateP 의 onBlur 를 적용했을 때, option 의 onClick 이 트리거되기 전에 먼저 실행되는 문제

이미지 리사이징에 영향을 받은 페이지 or 컴포넌트
- Carousel 컴포넌트 : Home 페이지(VerticalCard, CardCarousel 컴포넌트), Detail 페이지
- History 페이지, Purchase 페이지

구글
{
    "uid": "BMMbvEfvGNU8H2JNfI4yt3B84BO2",
    "email": "banghyechan@gmail.com",
    "emailVerified": true,
    "displayName": "방혜찬",
    "isAnonymous": false,
    "photoURL": "https://lh3.googleusercontent.com/a/ACg8ocIT0SbzGmIcUmd9LP3pCtmTsrCd_4KcrCm23ax2XrVeUNUooqA=s96-c",
    "providerData": [
        {
            "providerId": "google.com",
            "uid": "110914388599621811295",
            "displayName": "방혜찬",
            "email": "banghyechan@gmail.com",
            "phoneNumber": null,
            "photoURL": "https://lh3.googleusercontent.com/a/ACg8ocIT0SbzGmIcUmd9LP3pCtmTsrCd_4KcrCm23ax2XrVeUNUooqA=s96-c"
        }
    ],
    "stsTokenManager": {
        "refreshToken": "AMf-vBwLijzNhVz8tpnSrqa_OWopynwjYuX7ZzLDHhwvoOe0LzTfwia0KJfw-yWiJ80I1Dv7noSaKQZV4HMeGOhtMpId-YoA1dbPIHRji1r6p2lD2kW1hv6R8hr2ug4HkCTe7U4yRsOJMZDNtyt71VqPd2kGIhG5rSXVAzH0xr5xqavi9qWeKyAOQg3dQeTeA3E8FHQNU7MhOtiBt1E5zfdiBcGB5fthYbeGFUpUY6Fi3tmGs5nM9VFv9wENMIhDVpo66UL6gjqHPJJQ45llRl-GH1dpyuEqEk4IY6bvWAjnBl4v7mgkWKEkxTaXMQtpkB5G3Bfvj_kJiLnolWxNC1GqSR-QwB261DQ-9diqR3lZbBNvUyhNstKtQnpzMr9CjFjIEswrzGa-VMZZOKiZq3nCZjHNTz9Szcqdc1jl1ZLij2yaPvDs-iI",
        "accessToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImRjNjI2MmYzZTk3NzIzOWMwMDUzY2ViODY0Yjc3NDBmZjMxZmNkY2MiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoi67Cp7Zic7LCsIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0lUMFNiekdtSWNVbWQ5TFAzcEN0bVRzckNkXzRLY3JDbTIzYXgyWHJWZVVOVW9vcUE9czk2LWMiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vYnV5dGhpcy0zN2YzMyIsImF1ZCI6ImJ1eXRoaXMtMzdmMzMiLCJhdXRoX3RpbWUiOjE3NDA1NDg2NjksInVzZXJfaWQiOiJCTU1idkVmdkdOVThIMkpOZkk0eXQzQjg0Qk8yIiwic3ViIjoiQk1NYnZFZnZHTlU4SDJKTmZJNHl0M0I4NEJPMiIsImlhdCI6MTc0MDU0ODY2OSwiZXhwIjoxNzQwNTUyMjY5LCJlbWFpbCI6ImJhbmdoeWVjaGFuQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7Imdvb2dsZS5jb20iOlsiMTEwOTE0Mzg4NTk5NjIxODExMjk1Il0sImVtYWlsIjpbImJhbmdoeWVjaGFuQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6Imdvb2dsZS5jb20ifX0.q8ERaPLfunYCbfEKXklYTAbJavFPi2rHvAh6X-qooskvvmqrneq9Y_8-Ql9Vy-2kWVsagT3GCtIGwYLHcENx72ebW3BF1iia7RS1LNafclPAINnAiGOz6ONd1yU9fZrE4q8fwslfGpyRIQfdO5WfVmadRArl3ZvERaLBp79QdRPW12cvYZig3oC8DMLoVxpqGAbu3Ee4J7O5hwmE5vQG5KxCfsd4u0DK5He3XYXJY5etCq0aqvX7cUAUB-oA5vf4Ep1kE3JdMpD7cxgfPw71C0gAPcKwKorTBDnZxK9f5ULMkAEQ-I40ZdwOl5q0M7omwR7Prpw0UwneBmz5fTXHLQ",
        "expirationTime": 1740552269026
    },
    "createdAt": "1740548669491",
    "lastLoginAt": "1740548669492",
    "apiKey": "AIzaSyDR7gGOE90bFelJUEwZKkumoeYi5aq-9Tc",
    "appName": "[DEFAULT]"
}

트위터
{
    "uid": "SjbTbSsmk2NoMnC24A8tSreZ27O2",
    "emailVerified": false,
    "displayName": "방혜찬",
    "isAnonymous": false,
    "photoURL": "https://pbs.twimg.com/profile_images/1894318465668059137/BlJDiSKm_normal.png",
    "providerData": [
        {
            "providerId": "twitter.com",
            "uid": "1894318371950432256",
            "displayName": "방혜찬",
            "email": null,
            "phoneNumber": null,
            "photoURL": "https://pbs.twimg.com/profile_images/1894318465668059137/BlJDiSKm_normal.png"
        }
    ],
    "stsTokenManager": {
        "refreshToken": "AMf-vBwuZkd8Is_F1_PRPp72Ba5fpNbJaU1pPXCTMuD1-IERFG2pYLDqwT-WGK2VfSIN5GbLv-gMtkHLAiRQ2tR3XDaxfMhA-j1iJS6X6SvoGX56lr-w4c_0rR1omrgot4oeslin8MFKfeC5qAGNrjz2lr2B0-nGqkZRMoeupfIlLGDpY-d9lELyWDnf06WuLhI6iUBb_YiJ16MuNxNA23VhFDtC0Zok1mx2krlWXGcPQPMYirHUu2lpGZtye7J11GhgPykxmetf_s22xMDVbvOQE92maTfEW1PwuEvTE0sWV2TimUFuuoUbNBASuujdrrSucBoIu0HVOcDgrI8gcP7Xg8XJO5iWut9bR0UYdEUffq_ogC4Mj10",
        "accessToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImRjNjI2MmYzZTk3NzIzOWMwMDUzY2ViODY0Yjc3NDBmZjMxZmNkY2MiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoi67Cp7Zic7LCsIiwicGljdHVyZSI6Imh0dHBzOi8vcGJzLnR3aW1nLmNvbS9wcm9maWxlX2ltYWdlcy8xODk0MzE4NDY1NjY4MDU5MTM3L0JsSkRpU0ttX25vcm1hbC5wbmciLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vYnV5dGhpcy0zN2YzMyIsImF1ZCI6ImJ1eXRoaXMtMzdmMzMiLCJhdXRoX3RpbWUiOjE3NDA1NDgxNzMsInVzZXJfaWQiOiJTamJUYlNzbWsyTm9NbkMyNEE4dFNyZVoyN08yIiwic3ViIjoiU2piVGJTc21rMk5vTW5DMjRBOHRTcmVaMjdPMiIsImlhdCI6MTc0MDU0ODE3MywiZXhwIjoxNzQwNTUxNzczLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7InR3aXR0ZXIuY29tIjpbIjE4OTQzMTgzNzE5NTA0MzIyNTYiXX0sInNpZ25faW5fcHJvdmlkZXIiOiJ0d2l0dGVyLmNvbSJ9fQ.ExT7X7PaeC7JYPdibLn55ZTd47ud4TgAPJPh8uH1gvPeZN3bgHw1kKrw2u51NSZ3kJa8QCey0i4S6V3PGNTFqU1yK1MwxVnO_Z89XIs1v7c1JvpSQl9XX_sOQC8hczz8woVHodsMY49JFH0KMHNFdh9wv5idU17w7akLBFyRLeTENMOFpIr9UiPI73x-TsvoB63QbmbrhY1m-fP67LCbGTXJD9UgxkiWIqiPAXTKHAk4ionfpFTkG5ny001UopG9xa3En28CUebbPJmSR-cWMk76kQq_tKJ3IvUsdWqdcjNzfEU1KYXvy5fqJYU_NdC3WBMMfHppm52KCILHBvTBWA",
        "expirationTime": 1740551772696
    },
    "createdAt": "1740547694936",
    "lastLoginAt": "1740548128062",
    "apiKey": "AIzaSyDR7gGOE90bFelJUEwZKkumoeYi5aq-9Tc",
    "appName": "[DEFAULT]"
}

깃헙
{
    "uid": "uXHZsAk9GFgw2TvAKPtAEJ6knIH3",
    "email": "banghyechan@gmail.com",
    "emailVerified": false,
    "isAnonymous": false,
    "photoURL": "https://avatars.githubusercontent.com/u/200755721?v=4",
    "providerData": [
        {
            "providerId": "github.com",
            "uid": "200755721",
            "displayName": null,
            "email": "banghyechan@gmail.com",
            "phoneNumber": null,
            "photoURL": "https://avatars.githubusercontent.com/u/200755721?v=4"
        }
    ],
    "stsTokenManager": {
        "refreshToken": "AMf-vByc4frnP6ktA473VcXDKj_2JJ65HSGHYsh3IBiIptruEp-n9ghkGFoFd-UVEnBAULe0oBGTKWP2VkB1Pzjs43mw4iEoaw2xfXgqM82Doib_bql2DTrhlY8j5HzXZybhHHK7JJjzVdnJHVboxrc0GzsmfHQ-H9OyYyDSXKC0YLFIzH_4EoOpJ2HGNPF6OthrDiEWoa8t_NYp_arUIAow9rGtv_1kRRWuvDHpMTwEDXcAVkUWzOHeNbSWLFOok0LKi348hElsi9RBo0LSy5V7Rcx3zvz52H6m0sJ7YnrU6ZukD3c7WgnnQ6jGrfbAvR0DWEEFMvga",
        "accessToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImRjNjI2MmYzZTk3NzIzOWMwMDUzY2ViODY0Yjc3NDBmZjMxZmNkY2MiLCJ0eXAiOiJKV1QifQ.eyJwaWN0dXJlIjoiaHR0cHM6Ly9hdmF0YXJzLmdpdGh1YnVzZXJjb250ZW50LmNvbS91LzIwMDc1NTcyMT92PTQiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vYnV5dGhpcy0zN2YzMyIsImF1ZCI6ImJ1eXRoaXMtMzdmMzMiLCJhdXRoX3RpbWUiOjE3NDA1NDg4OTQsInVzZXJfaWQiOiJ1WEhac0FrOUdGZ3cyVHZBS1B0QUVKNmtuSUgzIiwic3ViIjoidVhIWnNBazlHRmd3MlR2QUtQdEFFSjZrbklIMyIsImlhdCI6MTc0MDU0ODg5NCwiZXhwIjoxNzQwNTUyNDk0LCJlbWFpbCI6ImJhbmdoeWVjaGFuQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJnaXRodWIuY29tIjpbIjIwMDc1NTcyMSJdLCJlbWFpbCI6WyJiYW5naHllY2hhbkBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJnaXRodWIuY29tIn19.Xi6pLb5FtFXDUSwD5lI6fosISMohDgQPqKjZy0NOw8Wj0WAeGqHs60VHlx8CUDWNjUQFYlIVE05TQDIYZcb1UvnVmGzYZm44fl8w_lFsAGXQBfEcrce9vmkngTV_5FFZ4DEXhbbiFI3Nf978yS81InOK497O-i2yLBGofiZxQ7zxA633nByhXbgRyrtDHlU8lqKaGE-G6yIarpgc48gR02G1NI2nanz6fRUjerJlcU4Z8Y4S0syP1b62I0HKIAorm6qgs7fuiNL-yuWB-FO4AcDox0dFzX-en9PCXEu3-Uz946V4V1mqmK14CmCuF1WdPVMGZZYW9ZQ5tChCFeJ9SA",
        "expirationTime": 1740552494055
    },
    "createdAt": "1740548894518",
    "lastLoginAt": "1740548894518",
    "apiKey": "AIzaSyDR7gGOE90bFelJUEwZKkumoeYi5aq-9Tc",
    "appName": "[DEFAULT]"
}

직접 로그인
{
    "uid": "bjxVzmkZy0ZcoTI3plZkBR29WYB2",
    "email": "test@test.com",
    "emailVerified": false,
    "displayName": "테스트#구매자",
    "isAnonymous": false,
    "providerData": [
        {
            "providerId": "password",
            "uid": "test@test.com",
            "displayName": "테스트#구매자",
            "email": "test@test.com",
            "phoneNumber": null,
            "photoURL": null
        }
    ],
    "stsTokenManager": {
        "refreshToken": "AMf-vBzcPSHXHaXlMBQ4x8n8QLyQDT9Utn57H2Y86Iaz2ByynjFB1_W3Lm8PCQddlLPYWi2yAF4EzAvP_n9qVgCgDlRqmrBvOEwlG060Xq6Kj262H_3QFNtdoJOGelVzjWYMv3YoYlJanFWWPSymd3fkKC5217uyZp9Q6JysqCNPxmTNFJJpECnF52VKwoDmKFPwu-FVlE1Cg4GT-ciK_vTpAigtV4EEo72iKGNTxvPBUkCR1vahV_s",
        "accessToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImRjNjI2MmYzZTk3NzIzOWMwMDUzY2ViODY0Yjc3NDBmZjMxZmNkY2MiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoi7YWM7Iqk7Yq4I-q1rOunpOyekCIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9idXl0aGlzLTM3ZjMzIiwiYXVkIjoiYnV5dGhpcy0zN2YzMyIsImF1dGhfdGltZSI6MTc0MDU0ODk4MywidXNlcl9pZCI6ImJqeFZ6bWtaeTBaY29USTNwbFprQlIyOVdZQjIiLCJzdWIiOiJianhWem1rWnkwWmNvVEkzcGxaa0JSMjlXWUIyIiwiaWF0IjoxNzQwNTQ4OTgzLCJleHAiOjE3NDA1NTI1ODMsImVtYWlsIjoidGVzdEB0ZXN0LmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJ0ZXN0QHRlc3QuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.OyfMHfeUy9SFRHB1jaesfXWlOAzsTwElJXqUFNJNK7Tuz77r7CXMoug3EAjIMRiPB-XnMy8Yshm3cMW5h8dYFKBqFj4hf7OQIskdgBUqEGs9sZW4VBLALubXzY1eQqMHGvO-J2zZbqB3yZHllT6kxEzDlVAjcXQyJ-mQo1HHBo9dpzrsH7G7gVp4xngQUR6Xy-muW-esJ7867PNcW7OXkNsplEaifXqkSX9URfsyffX8T30SNPYvtDo6A9ORMwe4d7WYClK6nhsiY0NCNZkoD64BeK7tzbC6eqS3DfEiA-VfobEufspIOFlEQ6KZ3wWOw139gGKyXt5NYLiVoft53w",
        "expirationTime": 1740552582716
    },
    "createdAt": "1721454198218",
    "lastLoginAt": "1740548983602",
    "apiKey": "AIzaSyDR7gGOE90bFelJUEwZKkumoeYi5aq-9Tc",
    "appName": "[DEFAULT]"
}