/**
 * PlayerForm — CricketOS Design System
 * ============================================
 * React Hook Form + Zod form body for creating/editing a player.
 * Rendered inside a <Form> provider (see PlayersPage).
 */
import { Box } from '@mui/material';
import { FormRow, FormInput, FormSelect, type SelectOption } from '@shared/components';
import {
  PLAYER_ROLE_LABELS,
  PLAYER_STATUS_LABELS,
  BATTING_STYLE_LABELS,
  BOWLING_STYLE_LABELS,
  type PlayerRole,
  type PlayerStatus,
  type BattingStyle,
  type BowlingStyle,
} from '@domain/index';

const roleOptions: SelectOption[] = (Object.keys(PLAYER_ROLE_LABELS) as PlayerRole[]).map((value) => ({
  value,
  label: PLAYER_ROLE_LABELS[value],
}));

const statusOptions: SelectOption[] = (Object.keys(PLAYER_STATUS_LABELS) as PlayerStatus[]).map((value) => ({
  value,
  label: PLAYER_STATUS_LABELS[value],
}));

const battingOptions: SelectOption[] = (Object.keys(BATTING_STYLE_LABELS) as BattingStyle[]).map((value) => ({
  value,
  label: BATTING_STYLE_LABELS[value],
}));

const bowlingOptions: SelectOption[] = (Object.keys(BOWLING_STYLE_LABELS) as BowlingStyle[]).map((value) => ({
  value,
  label: BOWLING_STYLE_LABELS[value],
}));

export function PlayerForm() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <FormRow columns={2}>
        <FormInput name="firstName" label="First name" required placeholder="Virat" />
        <FormInput name="lastName" label="Last name" required placeholder="Kohli" />
      </FormRow>

      <FormRow columns={2}>
        <FormInput name="email" label="Email" type="email" placeholder="player@club.com" />
        <FormInput name="phone" label="Phone" placeholder="+91 90000 00000" />
      </FormRow>

      <FormRow columns={2}>
        <FormSelect name="role" label="Role" required options={roleOptions} />
        <FormSelect name="status" label="Status" options={statusOptions} />
      </FormRow>

      <FormRow columns={2}>
        <FormSelect name="battingStyle" label="Batting style" options={battingOptions} />
        <FormSelect name="bowlingStyle" label="Bowling style" options={bowlingOptions} />
      </FormRow>

      <FormRow columns={2}>
        <FormInput name="nationality" label="Nationality" placeholder="India" />
        <FormInput name="dateOfBirth" label="Date of birth" type="date" />
      </FormRow>

      <FormRow columns={3}>
        <FormInput name="jerseyNumber" label="Jersey #" type="number" />
        <FormInput name="price" label="Price (₹)" type="number" />
        <FormInput name="ranking" label="Ranking" type="number" />
      </FormRow>
    </Box>
  );
}
