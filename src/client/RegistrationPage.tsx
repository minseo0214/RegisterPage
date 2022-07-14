import React from 'react'
import { useNavigate } from 'react-router-dom'

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
    return { check: false, text: '비밀번호가 서로 다릅니다.' }
  }

  if (!isGoodPassword(password)) {
    return {
      check: false,
      text: '최소 8자, 최소 하나의 문자 및 하나의 숫자를 입력하세요',
    }
  }

  const res = await fetch(`/api/user`, {
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

  if (res.status == 400) {
    return { check: false, text: '이미 가입된 이메일 입니다.' }
  }

  return { check: true, text: '가입되었습니다!' }
}

// 회원 가입 페이지
export default function RegisterPage() {
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [checkPassword, setCheckPassword] = React.useState('')
  const navigate = useNavigate()

  return (
    <div
      className="wrap"
      style={{
        fontSize: '40px',
        width: '600px',
        height: '500px',
        paddingTop: '40px',
      }}
    >
      Welcome
      <div className="feedBoxWrap">
        {/* username */}
        <form
          id="register"
          onSubmit={async (e) => {
            e.preventDefault()
            const { check, text } = await createUser(
              name,
              email,
              password,
              checkPassword
            )
            if (check) {
              alert(text)
              navigate('../')
            } else {
              alert(text)
            }
          }}
        >
          <input
            type="string"
            className="loginInput "
            placeholder="사용할 이름을 입력해주세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {/* email */}
          <input
            type="email"
            className="loginInput "
            placeholder="이메일을 입력해주세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {/* password */}
          <input
            className="loginInput "
            placeholder="(최소 8자, 최소 하나의 문자 및 하나의 숫자)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
          {/* confirm password */}
          <input
            className="loginInput "
            placeholder="비밀번호를 다시 입력해주세요"
            value={checkPassword}
            onChange={(e) => setCheckPassword(e.target.value)}
            type="password"
            required
          />
          <button
            className="loginInput"
            type="submit"
            style={{
              backgroundColor: 'rgb(241,155,61)',
              color: 'white',
              padding: '0px',
              marginBottom: '0px',
              cursor: 'pointer',
            }}
          >
            가입하기
          </button>
        </form>
      </div>
    </div>
  )
}
