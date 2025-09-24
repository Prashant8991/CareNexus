import { useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { AlertTriangle, CheckCircle2, Phone, Undo2 } from 'lucide-react'

type QuestionId =
  | 'conscious'
  | 'breathing'
  | 'severeBleeding'
  | 'age'
  | 'chestPain'
  | 'allergicReaction'
  | 'headInjury'
  | 'seizure'

type AnswerMap = Partial<Record<QuestionId, string>>

interface Question {
  id: QuestionId
  text: string
  type: 'yesno' | 'number' | 'choice'
  choices?: string[]
}

const triageQuestions: Question[] = [
  { id: 'conscious', text: 'Is the person conscious and responsive?', type: 'yesno' },
  { id: 'breathing', text: 'Is the person breathing normally?', type: 'yesno' },
  { id: 'severeBleeding', text: 'Is there severe bleeding?', type: 'yesno' },
  { id: 'age', text: 'Approximate age?', type: 'number' },
  { id: 'chestPain', text: 'Are they having chest pain or pressure?', type: 'yesno' },
  { id: 'allergicReaction', text: 'Signs of a severe allergic reaction (swelling, hives, trouble breathing)?', type: 'yesno' },
  { id: 'headInjury', text: 'Recent head injury with confusion, vomiting, or severe headache?', type: 'yesno' },
  { id: 'seizure', text: 'Currently having or recently had a seizure?', type: 'yesno' },
]

function computeAdvice(answers: AnswerMap): { level: 'critical' | 'urgent' | 'info'; notes: string[] } {
  const notes: string[] = []
  let level: 'critical' | 'urgent' | 'info' = 'info'

  const yes = (k: QuestionId) => answers[k]?.toLowerCase() === 'yes'
  const ageNum = answers.age ? parseInt(answers.age, 10) : undefined

  if (!answers.conscious || !answers.breathing) {
    // not enough info yet
    return { level: 'info', notes: ['Answer questions to get tailored guidance.'] }
  }

  if (answers.conscious === 'no' || answers.breathing === 'no') {
    level = 'critical'
    if (answers.conscious === 'no') notes.push('Unconscious: Start CPR if no breathing and no pulse.')
    if (answers.breathing === 'no') notes.push('Not breathing: Begin rescue breaths and CPR if trained.')
  }

  if (yes('severeBleeding')) {
    level = 'critical'
    notes.push('Apply firm direct pressure with clean cloth; elevate if possible.')
  }

  if (yes('chestPain')) {
    level = level === 'critical' ? 'critical' : 'urgent'
    notes.push('Chest pain: Have the person rest. Consider aspirin if not allergic and advised by a professional.')
  }

  if (yes('allergicReaction')) {
    level = 'critical'
    notes.push('Severe allergy: Use epinephrine auto-injector if available. Monitor breathing.')
  }

  if (yes('headInjury')) {
    level = level === 'critical' ? 'critical' : 'urgent'
    notes.push('Head injury with red flags: Keep still, avoid food/drink, seek immediate medical evaluation.')
  }

  if (yes('seizure')) {
    level = level === 'critical' ? 'critical' : 'urgent'
    notes.push('Seizure: Protect from injury, do not restrain or place anything in mouth, time the event.')
  }

  if (ageNum !== undefined && (ageNum < 1 || ageNum > 75)) {
    level = level === 'critical' ? 'critical' : 'urgent'
    if (ageNum < 1) notes.push('Infant involved: Special care required. Seek urgent help.')
    if (ageNum > 75) notes.push('Elderly patient: Higher risk—seek urgent evaluation.')
  }

  if (notes.length === 0) notes.push('Monitor closely and follow first aid steps for the specific condition.')

  return { level, notes }
}

export function FirstAidAssistant() {
  const [answers, setAnswers] = useState<AnswerMap>({})
  const [step, setStep] = useState(0)

  const current = triageQuestions[step]
  const { level, notes } = useMemo(() => computeAdvice(answers), [answers])

  const setAnswer = (id: QuestionId, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  const next = () => setStep((s) => Math.min(s + 1, triageQuestions.length - 1))
  const back = () => setStep((s) => Math.max(s - 1, 0))
  const reset = () => {
    setAnswers({})
    setStep(0)
  }

  const levelBadge = (
    <Badge variant={level === 'critical' ? 'destructive' : level === 'urgent' ? 'default' : 'secondary'}>
      {level.toUpperCase()}
    </Badge>
  )

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              First Aid Assistant
            </CardTitle>
            <CardDescription>
              Guided triage with common emergency questions. Your responses stay on this device.
            </CardDescription>
          </div>
          {levelBadge}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Question */}
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground">Question {step + 1} of {triageQuestions.length}</div>
          <div className="text-base font-medium">{current.text}</div>
          {current.type === 'yesno' && (
            <div className="flex gap-2">
              <Button onClick={() => setAnswer(current.id, 'yes')} variant={answers[current.id] === 'yes' ? 'default' : 'outline'}>Yes</Button>
              <Button onClick={() => setAnswer(current.id, 'no')} variant={answers[current.id] === 'no' ? 'default' : 'outline'}>No</Button>
            </div>
          )}
          {current.type === 'number' && (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Enter number"
                value={answers[current.id] ?? ''}
                onChange={(e) => setAnswer(current.id, e.target.value)}
                className="max-w-[200px]"
              />
              <Button variant="outline" onClick={next}>Save</Button>
            </div>
          )}
          {current.type === 'choice' && (
            <div className="flex flex-wrap gap-2">
              {current.choices?.map((c) => (
                <Button key={c} onClick={() => setAnswer(current.id, c)} variant={answers[current.id] === c ? 'default' : 'outline'}>
                  {c}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={back} disabled={step === 0}>
            <Undo2 className="w-4 h-4 mr-2" /> Back
          </Button>
          <Button onClick={next} disabled={step === triageQuestions.length - 1}>
            Next
          </Button>
          <Button variant="secondary" onClick={reset} className="ml-auto">Reset</Button>
        </div>

        {/* Advice */}
        <div className="rounded-md border p-3">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-chart-2" />
            <div className="font-medium">Advice</div>
          </div>
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            {notes.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
          {(level === 'critical' || level === 'urgent') && (
            <div className="mt-3">
              <Button variant={level === 'critical' ? 'destructive' : 'default'} onClick={() => window.open('tel:101', '_self')}>
                <Phone className="w-4 h-4 mr-2" /> Call 101 Now
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default FirstAidAssistant



