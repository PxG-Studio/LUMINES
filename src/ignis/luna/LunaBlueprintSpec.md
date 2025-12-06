# LUNA SPEC — Auto Blueprint Generation

LUNA must convert natural language → Ignis Blueprint Graph JSON.

## Overview

LUNA (Language Understanding & Node Assistant) is an AI system that generates Ignis Blueprint graphs from natural language descriptions. This document defines the specification for LUNA's blueprint generation capabilities.

## Input Format

LUNA accepts natural language descriptions of game logic:

```
"Make a character jump when the space bar is pressed and print 'Jump!'"
```

```
"When the game starts, spawn 5 enemies at random positions and play background music"
```

```
"If player health is less than 50, show a warning UI and play an alert sound"
```

## Output Format

LUNA generates valid Ignis Blueprint Graph JSON:

```json
{
  "id": "generated_graph_123456",
  "name": "Generated Blueprint",
  "nodes": [
    {
      "id": "n1",
      "type": "OnUpdate",
      "nodeType": "event",
      "title": "On Update",
      "position": { "x": 100, "y": 100 },
      "inputs": [],
      "outputs": [
        { "id": "exec_out", "name": "Exec", "type": "exec", "direction": "output" }
      ],
      "data": {}
    },
    {
      "id": "n2",
      "type": "Branch",
      "nodeType": "exec",
      "title": "Branch",
      "position": { "x": 300, "y": 100 },
      "inputs": [
        { "id": "exec_in", "name": "Exec", "type": "exec", "direction": "input" },
        { "id": "condition_in", "name": "Condition", "type": "bool", "direction": "input", "required": true }
      ],
      "outputs": [
        { "id": "true_out", "name": "True", "type": "exec", "direction": "output" },
        { "id": "false_out", "name": "False", "type": "exec", "direction": "output" }
      ],
      "data": {}
    },
    {
      "id": "n3",
      "type": "GetKeyDown",
      "nodeType": "data",
      "title": "Get Key Down",
      "position": { "x": 100, "y": 250 },
      "inputs": [
        { "id": "key_in", "name": "Key", "type": "string", "direction": "input", "required": true }
      ],
      "outputs": [
        { "id": "isdown_out", "name": "Is Down", "type": "bool", "direction": "output" }
      ],
      "data": { "key": "Space" }
    },
    {
      "id": "n4",
      "type": "Print",
      "nodeType": "exec",
      "title": "Print",
      "position": { "x": 500, "y": 100 },
      "inputs": [
        { "id": "exec_in", "name": "Exec", "type": "exec", "direction": "input" },
        { "id": "message_in", "name": "Message", "type": "string", "direction": "input", "required": true }
      ],
      "outputs": [
        { "id": "exec_out", "name": "Exec", "type": "exec", "direction": "output" }
      ],
      "data": { "message": "Jump!" }
    }
  ],
  "connections": [
    {
      "id": "c1",
      "fromNodeId": "n1",
      "fromSocketId": "exec_out",
      "toNodeId": "n2",
      "toSocketId": "exec_in"
    },
    {
      "id": "c2",
      "fromNodeId": "n3",
      "fromSocketId": "isdown_out",
      "toNodeId": "n2",
      "toSocketId": "condition_in"
    },
    {
      "id": "c3",
      "fromNodeId": "n2",
      "fromSocketId": "true_out",
      "toNodeId": "n4",
      "toSocketId": "exec_in"
    }
  ],
  "variables": [],
  "entryPoint": "n1",
  "metadata": {
    "generatedBy": "LUNA",
    "createdAt": 1234567890,
    "description": "Generated from: 'Make a character jump when the space bar is pressed and print Jump!'"
  }
}
```

## Generation Rules

### 1. Node Selection

- **Always prefer built-in nodes** from `NodeLibrary`
- **Use appropriate categories**: Flow, Math, Unity, Events, etc.
- **Select most specific node** that matches the intent

### 2. Entry Points

- **Always define at least one entry node**:
  - `Start` - for initialization logic
  - `OnUpdate` - for per-frame logic
  - `OnTriggerEnter` - for collision events
  - Custom event nodes for specific triggers

### 3. Socket Connections

- **Type-safe connections**: Only connect compatible socket types
  - `exec` → `exec` for flow
  - `bool` → `bool` for boolean values
  - `float` → `float` for numbers
  - `vector3` → `vector3` for vectors
  - `any` can connect to any type

- **Proper flow**: Exec sockets should form acyclic graphs
- **Required inputs**: Must be connected or have default values

### 4. Node Positioning

- **Left to right flow**: Entry nodes on left, execution flows right
- **Top to bottom**: Related nodes grouped vertically
- **Spacing**: Minimum 200px horizontal, 100px vertical between nodes

### 5. Constants and Data

- **Use constant nodes** for literal values:
  - `FloatConstant` for numbers
  - `StringConstant` for text
  - `BoolConstant` for true/false
  - `Vector3Constant` for positions/vectors

- **Store in node.data**: For configurable values that appear in node UI

## Example Mappings

### "When space is pressed, jump"

```
Input: "When space is pressed, jump"
↓
1. OnUpdate node (entry point)
2. GetKeyDown node (check Space key)
3. Branch node (if key down)
4. SetPosition or AddForce node (jump action)
Connections:
  - OnUpdate.exec → Branch.exec
  - GetKeyDown.IsDown → Branch.Condition
  - Branch.True → JumpAction.exec
```

### "Spawn 5 enemies at random positions"

```
Input: "Spawn 5 enemies at random positions"
↓
1. Start node (entry point)
2. Loop/Sequence node (for 5 iterations)
3. RandomRange node (random position)
4. SpawnPrefab node (spawn enemy)
Connections:
  - Start.exec → Loop.exec
  - Loop.output → SpawnPrefab.exec
  - RandomRange.Result → SpawnPrefab.Position
```

### "If health < 50, show warning and play sound"

```
Input: "If health < 50, show warning and play sound"
↓
1. OnUpdate node (check every frame)
2. Compare node (health < 50)
3. Branch node (if condition true)
4. ShowUI node (warning)
5. PlaySound node (alert)
Connections:
  - OnUpdate.exec → Branch.exec
  - Compare.Result → Branch.Condition
  - Branch.True → ShowUI.exec → PlaySound.exec
```

## Validation Rules

### Graph Validation

1. **Must have entry point**: At least one event node with no input exec sockets
2. **No cycles**: Exec flow must be acyclic (use Delay for async loops)
3. **All required inputs connected**: All required sockets must have connections or defaults
4. **Type compatibility**: All connections must be type-compatible

### Node Validation

1. **Valid node types**: Only use registered node types
2. **Valid socket IDs**: Socket IDs must be unique within node
3. **Valid positions**: Positions should be non-negative integers
4. **Valid data**: Node data must match expected structure

## LUNA Prompt Template

When requesting LUNA to generate a blueprint:

```
System: You are LUNA, an AI assistant that generates Ignis Blueprint graphs from natural language.

User: [Natural language description]

LUNA Output: {
  "graph": {
    // Full BlueprintGraph JSON
  },
  "explanation": "Brief explanation of the generated graph",
  "suggestions": [
    "Optional improvements or extensions"
  ]
}
```

## Error Handling

If LUNA cannot generate a valid graph:

1. **Partial generation**: Generate what is possible, mark incomplete nodes
2. **Suggestions**: Provide suggestions for completing the graph
3. **Alternative approaches**: Suggest alternative node combinations

## Advanced Features

### Multi-Step Logic

For complex logic chains, LUNA should:

1. **Break into steps**: Identify logical steps in the description
2. **Generate intermediate nodes**: Create nodes for each step
3. **Chain connections**: Connect steps in logical order

### Conditional Logic

For conditionals:

1. **Identify condition**: Extract the boolean condition
2. **Create Branch node**: Use Branch for true/false paths
3. **Separate actions**: Create separate action chains for each branch

### Loops and Iteration

For repetitive actions:

1. **Use Sequence node**: For fixed number of iterations
2. **Use Delay + Branch**: For loops that can break
3. **Avoid infinite loops**: Always provide exit conditions

## Integration

LUNA blueprint generation integrates with:

- **BlueprintEditor**: Direct graph creation
- **NodeLibrary**: Node discovery and validation
- **RuntimeBinder**: Execution verification
- **CSharpGenerator**: Code generation validation

This specification enables LUNA to generate production-ready blueprint graphs that can be immediately executed in Unity.

