export function emailValidator(email) {
  const re = /\S+@\S+\.\S+/
  if (!email) return "* דוא״ל חובה"
  if (!re.test(email)) return '* דוא״ל שגוי'
  return ''
}
