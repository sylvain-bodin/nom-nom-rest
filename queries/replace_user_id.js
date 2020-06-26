db.recipes.update(
  {},
  [
    { $set: { userId: '$user_id' } },
    { $unset: ['user_id'] }
  ],
  { multi: true }
);
