export function passwordValidator(password) {
  if (!password) return "* סיסמה חובה"
  if (password.length < 5) return '* סיסמה לפחות 5 אותיות או מספרים'
  return ''
}
