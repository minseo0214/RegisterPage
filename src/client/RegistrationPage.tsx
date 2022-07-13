import React from 'react'

// 정상적인 이메일 포맷인지 확인
const isEmail = (email: string) => {
  const emailRegex =
    /^(([^<>()\[\].,;:\s@"]+(\.[^<>()\[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i

  return emailRegex.test(email)
}

const isSamePassword = (password: string, checkPassword: string) => {
  return password === checkPassword
}

const isGoodPassword = (password: string) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
  return passwordRegex.test(password)
}

const createUser = async (
  name: string,
  email: string,
  password: string,
  checkPassword: string
) => {
  if (!(isEmail(email) && isSamePassword(password, checkPassword))) {
    throw new Error('입력한 정보를 다시 확인해주세요')
  }

  if (!isGoodPassword(password)) {
    throw new Error(
      '최소 8자, 최소 하나의 문자 및 하나의 숫자의 비밀번호를 사용해주세요'
    )
  }

  return await fetch(`/user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  })
}

export default function RegisterPage() {
  // 회원 가입 페이지
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [checkPassword, setCheckPassword] = React.useState('')

  return (
    <div className="container">
      Welcome
      {/* username */}
      <div>
        username
        <input
          placeholder="사용할 이름을 입력해주세요"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      {/* email */}
      <div>
        Email
        <input
          placeholder="이메일을 입력해주세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      {/* password */}
      <div>
        Password (최소 8자, 최소 하나의 문자 및 하나의 숫자의 비밀번호를
        사용해주세요)
        <input
          placeholder="설정할 비밀번호를 입력해주세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />
      </div>
      {/* confirm password */}
      <div>
        Confirm Password
        <input
          placeholder="비밀번호를 다시 입력해주세요"
          value={checkPassword}
          onChange={(e) => setCheckPassword(e.target.value)}
          type="password"
        />
      </div>
      <button
        onClick={() => {
          try {
            createUser(name, email, password, checkPassword)
          } catch (e) {
            if (e instanceof Error) {
              alert(e.message)
            }
          }
        }}
      >
        submit
      </button>
    </div>
  )
}
