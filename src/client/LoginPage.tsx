import React from 'react'

// 로그인
const login = async (loginEmail: string, loginPassword: string) => {
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
  }
}

export default function LoginPage() {
  const [loginEmail, setLoginEmail] = React.useState('')
  const [loginPassword, setLoginPassword] = React.useState('')

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
      <button onClick={() => login(loginEmail, loginPassword)}>submit</button>
    </div>
  )
}
