import { createAction, createFeature, createReducer, on, props } from '@ngrx/store';

export interface SharedUser {
  id: string;
  name: string;
}

export interface MfeCommunicationState {
  selectedUser: SharedUser | null;
}

export const selectUserForProducts = createAction(
  '[User Feature] Select user for products',
  props<{ user: SharedUser }>(),
);

export const clearSelectedUser = createAction('[User Feature] Clear selected user');

const initialState: MfeCommunicationState = {
  selectedUser: null,
};

export const mfeCommunicationFeature = createFeature({
  name: 'mfeCommunication',
  reducer: createReducer(
    initialState,
    on(selectUserForProducts, (_state, { user }) => ({ selectedUser: user })),
    on(clearSelectedUser, () => initialState),
  ),
});
