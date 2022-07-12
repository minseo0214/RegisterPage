import React from 'react'

// 로그인
const [userId, setUserId] = React.useState<number>()
const [loginEmail, setLoginEmail] = React.useState('')
const [loginPassword, setLoginPassword] = React.useState('')

const login = () => {
  fetch(`/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: loginEmail,
      password: loginPassword,
    }),
  }).then((res) => {
    if (!res.ok) {
      alert('아이디나 비밀번호가 틀렸습니다')
    } else {
      const setUser = async () => {
        const res = await fetch(`/user/${loginEmail}`)
        const user_Id = await res.json()
        setUserId(user_Id.rows[0].id)
      }
      setUser()
    }
  })
}

// review: 컴포넌트로 쪼개 주세요.
export default function LoginPage() {
  return (
    <div>
      {/* email */}
      <div>
        email
        <input
          placeholder="이메일을 입력해주세요."
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
          type="email"
        />
      </div>
      {/* password */}
      <div>
        password
        <input
          placeholder="비밀번호를 입력해주세요."
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
          type="password"
        />
      </div>
      {/* submit */}
      <button onClick={() => login()}>submit</button>
    </div>
  )
}
