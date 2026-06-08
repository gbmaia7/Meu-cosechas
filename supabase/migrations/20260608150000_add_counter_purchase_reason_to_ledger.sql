alter table public.loyalty_points_ledger
  drop constraint loyalty_points_ledger_reason_check;

alter table public.loyalty_points_ledger
  add constraint loyalty_points_ledger_reason_check
    check (reason = any (array[
      'purchase',
      'double_points',
      'reward_redeem',
      'referral_bonus',
      'expiration',
      'manual',
      'counter_purchase',
      'counter_purchase_cancelled'
    ]));
