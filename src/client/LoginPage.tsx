import React from 'react'
import { useNavigate } from 'react-router-dom'

// 로그인
const login = async (
  loginEmail: string,
  loginPassword: string,
  navigate: (path: string) => void
) => {
  const res = await fetch(`/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: loginEmail,
      password: loginPassword,
    }),
  })
  if (!res.ok) {
    alert('아이디나 비밀번호가 틀렸습니다')
  } else {
    navigate('/text')
  }
}

export default function LoginPage() {
  const [loginEmail, setLoginEmail] = React.useState('')
  const [loginPassword, setLoginPassword] = React.useState('')
  const navigate = useNavigate()

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
      <button onClick={() => login(loginEmail, loginPassword, navigate)}>
        로그인
      </button>
    </div>
  )
}
