// Mock database for testing
import { vi } from 'vitest';

// Result returned by the final where() call for select queries
const selectWhereResult = vi.fn().mockResolvedValue([]);

// Build the select chain properly: db.select().from().where()
const selectWhereChain = vi.fn().mockReturnValue(selectWhereResult);
const selectFromObject = { where: selectWhereChain };
const selectFromChain = vi.fn().mockReturnValue(selectFromObject);
const selectReturnObject = { from: selectFromChain };

// For insert operations: db.insert().values()
const insertValuesChain = vi.fn().mockResolvedValue({});
const insertReturnObject = { values: insertValuesChain };

// For delete operations: db.delete().where()
const deleteWhereChain = vi.fn().mockResolvedValue({});
const deleteReturnObject = { where: deleteWhereChain };

// For update operations: db.update().set().where()
const updateSetWhereChain = vi.fn().mockResolvedValue({});
const updateSetObject = { where: updateSetWhereChain };
const updateSetChain = vi.fn().mockReturnValue(updateSetObject);
const updateReturnObject = { set: updateSetChain };

export const db = {
  select: vi.fn().mockReturnValue(selectReturnObject),
  insert: vi.fn().mockReturnValue(insertReturnObject),
  delete: vi.fn().mockReturnValue(deleteReturnObject),
  update: vi.fn().mockReturnValue(updateReturnObject),
  // Expose mocks for test manipulation
  _selectWhereResult: selectWhereResult,
  _insertValuesChain: insertValuesChain,
  _deleteWhereChain: deleteWhereChain,
  _updateSetWhereChain: updateSetWhereChain
};
