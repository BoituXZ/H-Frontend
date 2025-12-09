import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
  state,
  AnimationTriggerMetadata,
} from '@angular/animations';

/**
 * Fade in animation
 */
export const fadeInAnimation: AnimationTriggerMetadata = trigger('fadeIn', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('500ms ease-in', style({ opacity: 1 })),
  ]),
]);

/**
 * Slide up animation with fade
 */
export const slideUpAnimation: AnimationTriggerMetadata = trigger('slideUp', [
  transition(':enter', [
    style({ transform: 'translateY(20px)', opacity: 0 }),
    animate(
      '400ms ease-out',
      style({ transform: 'translateY(0)', opacity: 1 }),
    ),
  ]),
  transition(':leave', [
    animate(
      '300ms ease-in',
      style({ transform: 'translateY(-20px)', opacity: 0 }),
    ),
  ]),
]);

/**
 * Slide down animation (for error messages)
 */
export const slideDownAnimation: AnimationTriggerMetadata = trigger(
  'slideDown',
  [
    transition(':enter', [
      style({ transform: 'translateY(-10px)', opacity: 0, height: 0 }),
      animate(
        '300ms ease-out',
        style({ transform: 'translateY(0)', opacity: 1, height: '*' }),
      ),
    ]),
    transition(':leave', [
      animate(
        '200ms ease-in',
        style({ transform: 'translateY(-10px)', opacity: 0, height: 0 }),
      ),
    ]),
  ],
);

/**
 * Shake animation for errors
 */
export const shakeAnimation: AnimationTriggerMetadata = trigger('shake', [
  transition('* => shake', [
    style({ transform: 'translateX(0)' }),
    animate('0.1s', style({ transform: 'translateX(-10px)' })),
    animate('0.1s', style({ transform: 'translateX(10px)' })),
    animate('0.1s', style({ transform: 'translateX(-10px)' })),
    animate('0.1s', style({ transform: 'translateX(10px)' })),
    animate('0.1s', style({ transform: 'translateX(0)' })),
  ]),
]);

/**
 * Scale animation
 */
export const scaleAnimation: AnimationTriggerMetadata = trigger('scale', [
  transition(':enter', [
    style({ transform: 'scale(0.8)', opacity: 0 }),
    animate(
      '300ms cubic-bezier(0.4, 0, 0.2, 1)',
      style({ transform: 'scale(1)', opacity: 1 }),
    ),
  ]),
  transition(':leave', [
    animate(
      '200ms cubic-bezier(0.4, 0, 0.2, 1)',
      style({ transform: 'scale(0.8)', opacity: 0 }),
    ),
  ]),
]);

/**
 * List animation with stagger
 */
export const listAnimation: AnimationTriggerMetadata = trigger(
  'listAnimation',
  [
    transition('* => *', [
      query(
        ':enter',
        [
          style({ opacity: 0, transform: 'translateY(10px)' }),
          stagger(100, [
            animate(
              '300ms ease-out',
              style({ opacity: 1, transform: 'translateY(0)' }),
            ),
          ]),
        ],
        { optional: true },
      ),
    ]),
  ],
);

/**
 * Route transition animations
 */
export const routeAnimations: AnimationTriggerMetadata = trigger(
  'routeAnimations',
  [
    transition('* <=> *', [
      query(
        ':enter, :leave',
        [
          style({
            position: 'absolute',
            width: '100%',
          }),
        ],
        { optional: true },
      ),
      query(':enter', [style({ opacity: 0, transform: 'translateX(100px)' })], {
        optional: true,
      }),
      query(
        ':leave',
        [
          animate(
            '300ms ease-out',
            style({ opacity: 0, transform: 'translateX(-100px)' }),
          ),
        ],
        { optional: true },
      ),
      query(
        ':enter',
        [
          animate(
            '300ms ease-out',
            style({ opacity: 1, transform: 'translateX(0)' }),
          ),
        ],
        { optional: true },
      ),
    ]),
  ],
);

/**
 * Expand/Collapse animation
 */
export const expandCollapseAnimation: AnimationTriggerMetadata = trigger(
  'expandCollapse',
  [
    state(
      'collapsed',
      style({
        height: '0',
        overflow: 'hidden',
        opacity: 0,
      }),
    ),
    state(
      'expanded',
      style({
        height: '*',
        overflow: 'visible',
        opacity: 1,
      }),
    ),
    transition('collapsed <=> expanded', [
      animate('300ms cubic-bezier(0.4, 0, 0.2, 1)'),
    ]),
  ],
);

/**
 * Pulse animation
 */
export const pulseAnimation: AnimationTriggerMetadata = trigger('pulse', [
  transition('* => pulse', [
    animate('1s', style({ transform: 'scale(1)' })),
    animate('0.5s', style({ transform: 'scale(1.05)' })),
    animate('0.5s', style({ transform: 'scale(1)' })),
  ]),
]);

/**
 * Rotation animation
 */
export const rotateAnimation: AnimationTriggerMetadata = trigger('rotate', [
  state('initial', style({ transform: 'rotate(0deg)' })),
  state('rotated', style({ transform: 'rotate(180deg)' })),
  transition('initial <=> rotated', [animate('300ms ease-in-out')]),
]);

// Named exports for backward compatibility
export const fadeIn = fadeInAnimation;
export const slideUp = slideUpAnimation;
