# Task: TryIt Module - Parameter Schema Hints

## Problem
Users selecting a tool in TryIt don't know what parameters to provide. They see generic "parameter" / "value" inputs with no hints.

## Solution
Fetch and display the tool's input schema so users know exactly what to provide.

## Implementation

### 1. Fetch Tool Schema
MCP tools have `inputSchema` in their definition. When user selects a tool:
- Look up the tool's schema from the available tools list
- The tools are already fetched (see existing code in TryItModule.tsx)

### 2. Update State
Add state to track:
- `toolSchema: JSONSchema | null` - the selected tool's inputSchema
- Update when tool selection changes

### 3. Render Parameter Fields
Instead of generic parameter/value inputs, render based on schema:

```tsx
interface ToolParameter {
  name: string;
  type: string;
  description?: string;
  required: boolean;
  default?: any;
}

// Parse schema properties into parameter list
const getParametersFromSchema = (schema: any): ToolParameter[] => {
  if (!schema?.properties) return [];
  const required = schema.required || [];
  return Object.entries(schema.properties).map(([name, prop]: [string, any]) => ({
    name,
    type: prop.type || 'string',
    description: prop.description,
    required: required.includes(name),
    default: prop.default,
  }));
};
```

### 4. UI Design
```
Select tool: [get_portfolio ▼]

Parameters:
┌─────────────────────────────────────────────────────────────┐
│ wallet_address                                    required  │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ 0x...                                                   ││
│ └─────────────────────────────────────────────────────────┘│
│ The wallet address to fetch portfolio for                   │
├─────────────────────────────────────────────────────────────┤
│ chain                                             optional  │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ base                                           (default)││
│ └─────────────────────────────────────────────────────────┘│
│ Chain to query (base, ethereum, etc.)                       │
└─────────────────────────────────────────────────────────────┘
```

### 5. Code Changes

In `TryItModule.tsx`:

```tsx
// Add to existing Tool interface or create new
interface ToolSchema {
  type: string;
  properties?: Record<string, {
    type: string;
    description?: string;
    default?: any;
  }>;
  required?: string[];
}

// In component, derive params from selected tool
const selectedToolSchema = useMemo(() => {
  if (!selectedTool || !tools.length) return null;
  const tool = tools.find(t => t.name === selectedTool);
  return tool?.inputSchema || null;
}, [selectedTool, tools]);

const schemaParams = useMemo(() => {
  if (!selectedToolSchema?.properties) return [];
  const required = selectedToolSchema.required || [];
  return Object.entries(selectedToolSchema.properties).map(([name, prop]: [string, any]) => ({
    name,
    type: prop.type || 'string',
    description: prop.description,
    required: required.includes(name),
    defaultValue: prop.default,
  }));
}, [selectedToolSchema]);

// Initialize params state from schema when tool changes
useEffect(() => {
  if (schemaParams.length > 0) {
    const initialParams = schemaParams.map(p => ({
      key: p.name,
      value: p.defaultValue?.toString() || '',
    }));
    setParams(initialParams);
  } else {
    setParams([{ key: '', value: '' }]);
  }
}, [schemaParams]);
```

### 6. Render Schema-Based Inputs

```tsx
{schemaParams.length > 0 ? (
  <div className="space-y-3">
    {schemaParams.map((param) => (
      <div key={param.name} className="space-y-1">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-[var(--foreground-muted)]">
            {param.name}
            <span className="ml-2 text-xs text-[var(--foreground-subtle)]">
              {param.type}
            </span>
          </label>
          <span className={`text-xs ${param.required ? 'text-red-400' : 'text-[var(--foreground-subtle)]'}`}>
            {param.required ? 'required' : 'optional'}
          </span>
        </div>
        <input
          type="text"
          value={params.find(p => p.key === param.name)?.value || ''}
          onChange={(e) => updateParam(param.name, e.target.value)}
          placeholder={param.defaultValue ? `Default: ${param.defaultValue}` : `Enter ${param.name}`}
          className="w-full px-3 py-2 rounded-lg border border-[var(--surface-border)] bg-[var(--background)] text-sm"
        />
        {param.description && (
          <p className="text-xs text-[var(--foreground-subtle)]">{param.description}</p>
        )}
      </div>
    ))}
  </div>
) : (
  // Fallback to current generic param inputs
  <div>...</div>
)}
```

## Files to Modify
- `src/components/AgentDetail/TryItModule.tsx`

## Testing
1. Go to an agent with MCP tools (e.g., Gekko)
2. Select different tools from dropdown
3. Verify parameter fields update to match tool schema
4. Verify required/optional labels show correctly
5. Verify descriptions appear below inputs
6. Test that execute still works with schema-derived params
