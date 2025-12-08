# CreateCircleModalComponent

A standalone Angular modal component for creating new savings circles in the HiveFund PWA.

## Features

- ✅ **Reactive Form Validation** - Real-time validation with user-friendly error messages
- ✅ **Smart Summary Calculator** - Dynamic calculation of cycle duration, total commitment, and payout value
- ✅ **Glassmorphism Design** - Modern UI with backdrop blur matching HiveFund aesthetic
- ✅ **Responsive Layout** - Works on mobile, tablet, and desktop
- ✅ **Accessibility** - Keyboard navigation (ESC to close), ARIA labels, and focus management
- ✅ **Animations** - Smooth entrance/exit animations and shake animation for validation errors

## Usage

### Import the Component

```typescript
import { CreateCircleModalComponent, CreateCircleRequest } from "../../shared/components/create-circle-modal/create-circle-modal";

@Component({
  imports: [CreateCircleModalComponent],
  // ...
})
export class YourComponent {
  showModal = signal(false);

  onCloseModal(): void {
    this.showModal.set(false);
  }

  onSubmitCircle(request: CreateCircleRequest): void {
    // Handle the circle creation
    console.log("Circle data:", request);
    this.showModal.set(false);
  }
}
```

### Template Usage

```html
@if (showModal()) {
<app-create-circle-modal (closeModal)="onCloseModal()" (submitCircle)="onSubmitCircle($event)" />
}
```

## Form Fields

| Field                   | Type         | Validation              | Default | Description                         |
| ----------------------- | ------------ | ----------------------- | ------- | ----------------------------------- |
| **Name**                | Text         | Required, 3-50 chars    | -       | Circle name (e.g., "MSU Hustlers")  |
| **Description**         | Textarea     | Optional, max 200 chars | -       | What the circle is for              |
| **Contribution Amount** | Number       | Required, $5-$1000      | $20     | Monthly or weekly contribution      |
| **Frequency**           | Pill Select  | Required                | Monthly | Weekly or Monthly payments          |
| **Max Members**         | Range Slider | Required, 2-12          | 8       | Maximum number of circle members    |
| **Start Date**          | Date         | Required, future date   | -       | First payment date                  |
| **Position Method**     | Pill Select  | Required                | Lottery | How payout positions are determined |

## Events

### `@Output() closeModal: EventEmitter<void>`

Emitted when the user closes the modal via:

- Clicking the X button
- Clicking the backdrop
- Pressing ESC key
- Clicking the Cancel button

### `@Output() submitCircle: EventEmitter<CreateCircleRequest>`

Emitted when the form is valid and user clicks "Create Circle". Contains the form data:

```typescript
interface CreateCircleRequest {
  name: string;
  description?: string;
  contributionAmount: number;
  frequency: "weekly" | "monthly";
  maxMembers: number;
  startDate: string; // ISO date format
  positionMethod: "lottery" | "vote";
}
```

## Smart Summary

The modal includes a dynamic summary card that automatically calculates:

- **Cycle Duration**: Based on `maxMembers` and `frequency` (e.g., "8 Months" or "8 Weeks")
- **Total Commitment**: `contributionAmount × maxMembers` (e.g., "$20 × 8 = $160")
- **Payout Value**: The lump sum received when it's your turn (same as total commitment)

These values update in real-time as the user modifies the form fields.

## Styling

The component uses:

- **Glassmorphism** with `backdrop-filter: blur()`
- **Honey-themed colors** matching the HiveFund design system
- **Responsive grid layout** that stacks on mobile
- **Custom CSS** for slider, pills, and animations
- **Dark mode support** via `@media (prefers-color-scheme: dark)`

## Validation Rules

- **Name**: 3-50 characters
- **Description**: 0-200 characters
- **Amount**: $5 minimum, $1000 maximum
- **Members**: 2-12 participants
- **Start Date**: Must be in the future
- **All required fields** must be filled before submission

## Error Handling

- Individual field errors appear below each input
- Form-wide error banner shows if user tries to submit invalid form
- Shake animation on submit attempt with invalid data
- Real-time validation feedback with color-coded inputs (red/green borders)

## Animations

- **Modal entrance**: Scale up with fade in (300ms)
- **Modal exit**: Scale down with fade out (200ms)
- **Overlay**: Fade in/out (200ms/150ms)
- **Validation error**: Shake animation (500ms)

## Browser Support

- Modern browsers with ES2020+ support
- CSS backdrop-filter support (fallback styling included)
- Works in Angular 17+ standalone mode

## Dependencies

- `@angular/forms` - ReactiveFormsModule
- `@angular/animations` - For entrance/exit animations
- `lucide-angular` - Icons (X, DollarSign, Users, Calendar, etc.)
- `FormErrorComponent` - Displays validation errors
- `LoadingSpinnerComponent` - Shows loading state (if needed)

## Example Integration (Circles Page)

See `/src/app/pages/circles/circles.page.ts` for a complete working example.

## Future Enhancements

- [ ] Multi-step wizard for complex configurations
- [ ] Invite members during creation
- [ ] Circle templates (quick start)
- [ ] Advanced settings (grace periods, penalties)
- [ ] Preview mode before final submission
