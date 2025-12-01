# Storybook Comprehensive Organization Guide
## WISSIL UI/UX Components & Functions Organization

**Version:** 1.0.0
**Date:** December 2024
**Framework:** Storybook 8.0
**System:** WISSIL (Waypoint, Ignition, Slate, Spark, Ignis, Landing)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Storybook Architecture Overview](#storybook-architecture-overview)
3. [Component Organization Strategy](#component-organization-strategy)
4. [Page-by-Page Component Breakdown](#page-by-page-component-breakdown)
5. [Story Organization Patterns](#story-organization-patterns)
6. [Visual Flowcharts](#visual-flowcharts)
7. [Component Hierarchy Diagrams](#component-hierarchy-diagrams)
8. [Story Organization Mindmaps](#story-organization-mindmaps)
9. [UI/UX Function Mapping](#uiux-function-mapping)
10. [Best Practices & Guidelines](#best-practices--guidelines)

---

## Executive Summary

This document provides a comprehensive guide for organizing Storybook stories, components, and UI/UX functions across all 6 WISSIL pages. The organization follows Atomic Design principles, ensuring consistency, maintainability, and comprehensive documentation.

### Key Principles

1. **Atomic Design Hierarchy**: Atoms → Molecules → Organisms → Templates → Pages
2. **Story Organization**: Grouped by system, then by component type
3. **Documentation**: Each component has stories, MDX docs, and interaction tests
4. **Accessibility**: All components include a11y addon stories
5. **Responsive Design**: Viewport variants for all components

---

## Storybook Architecture Overview

### Storybook Structure

```
Storybook (localhost:6006)
│
├── WISSIL/
│   │
│   ├── Landing/
│   │   ├── Documentation (MDX)
│   │   ├── Pages/
│   │   │   └── Main Gateway
│   │   │       ├── Default
│   │   │       ├── WithLayout
│   │   │       ├── Mobile
│   │   │       ├── Tablet
│   │   │       └── WideScreen
│   │   │
│   │   ├── Organisms/
│   │   │   ├── HeroSection
│   │   │   ├── SystemsGrid
│   │   │   └── FeaturesSection
│   │   │
│   │   ├── Molecules/
│   │   │   ├── SystemCard
│   │   │   ├── FeatureCard
│   │   │   └── CTAGroup
│   │   │
│   │   └── Atoms/
│   │       ├── GradientButton
│   │       ├── StatusBadge
│   │       └── SystemIcon
│   │
│   ├── Slate/
│   │   ├── Documentation (MDX)
│   │   ├── Pages/
│   │   │   └── Workspace & Identity
│   │   ├── Organisms/
│   │   │   ├── TokenExplorer
│   │   │   ├── ColorSystemViewer
│   │   │   └── TypographyScale
│   │   ├── Molecules/
│   │   │   ├── TokenCard
│   │   │   ├── ColorSwatch
│   │   │   └── TypographySample
│   │   └── Atoms/
│   │       ├── ColorBox
│   │       ├── FontSample
│   │       └── SpacingVisualizer
│   │
│   ├── Ignition/
│   │   ├── Documentation (MDX)
│   │   ├── Pages/
│   │   │   └── Project Bootstrap
│   │   ├── Organisms/
│   │   │   ├── TemplateGallery
│   │   │   ├── ConfigurationWizard
│   │   │   └── ProjectPreview
│   │   ├── Molecules/
│   │   │   ├── TemplateCard
│   │   │   ├── WizardStep
│   │   │   └── DependencySelector
│   │   └── Atoms/
│   │       ├── TemplateIcon
│   │       ├── StepIndicator
│   │       └── DependencyBadge
│   │
│   ├── Spark/
│   │   ├── Documentation (MDX)
│   │   ├── Pages/
│   │   │   └── IDE Experience
│   │   ├── Organisms/
│   │   │   ├── PromptInput
│   │   │   ├── MoEDisplay
│   │   │   ├── CodeOutput
│   │   │   └── PreviewPanel
│   │   ├── Molecules/
│   │   │   ├── ExpertCard
│   │   │   ├── CodeEditor
│   │   │   └── QuickPrompt
│   │   └── Atoms/
│   │       ├── AIBadge
│   │       ├── CodeBlock
│   │       └── LoadingSpinner
│   │
│   ├── Ignis/
│   │   ├── Documentation (MDX)
│   │   ├── Pages/
│   │   │   └── API Backend
│   │   ├── Organisms/
│   │   │   ├── BuildMetrics
│   │   │   ├── OptimizationPanel
│   │   │   └── BuildHistory
│   │   ├── Molecules/
│   │   │   ├── MetricCard
│   │   │   ├── OptimizationToggle
│   │   │   └── HistoryItem
│   │   └── Atoms/
│   │       ├── ProgressBar
│   │       ├── MetricValue
│   │       └── StatusIcon
│   │
│   └── Waypoint/
│       ├── Documentation (MDX)
│       ├── Pages/
│       │   └── Unity Visual Scripting
│       ├── Organisms/
│       │   ├── GraphEditor
│       │   ├── NodeInspector
│       │   └── NodeRegistry
│       ├── Molecules/
│       │   ├── NodeCard
│       │   ├── ConnectionLine
│       │   └── PropertyEditor
│       └── Atoms/
│           ├── NodePort
│           ├── NodeIcon
│           └── ConnectionPoint
│
└── Shared/
    ├── Layouts/
    │   └── WISSILLayout
    ├── Atoms/
    │   ├── Button
    │   ├── Input
    │   ├── Badge
    │   └── Icon
    └── Molecules/
        ├── Card
        ├── Modal
        └── Tooltip
```

---

## Component Organization Strategy

### Atomic Design Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ATOMIC DESIGN HIERARCHY                                   │
└─────────────────────────────────────────────────────────────────────────────┘

LEVEL 1: ATOMS
├── Basic building blocks
├── Cannot be broken down further
├── Examples: Button, Input, Badge, Icon, Spinner
└── Story Organization: WISSIL/Shared/Atoms/{ComponentName}

LEVEL 2: MOLECULES
├── Simple combinations of atoms
├── Form groups, card headers, input groups
├── Examples: InputGroup, CardHeader, CTAGroup
└── Story Organization: WISSIL/{System}/Molecules/{ComponentName}

LEVEL 3: ORGANISMS
├── Complex UI components
├── Sections of interface
├── Examples: HeroSection, SystemsGrid, TokenExplorer
└── Story Organization: WISSIL/{System}/Organisms/{ComponentName}

LEVEL 4: TEMPLATES
├── Page-level layouts
├── WISSILLayout wrapper
├── Examples: DashboardLayout, AuthLayout
└── Story Organization: WISSIL/Shared/Layouts/{TemplateName}

LEVEL 5: PAGES
├── Complete page implementations
├── Full user flows
├── Examples: LandingPage, SparkPage, IgnitionPage
└── Story Organization: WISSIL/{System}/Pages/{PageName}
```

### Story Naming Convention

```
Pattern: WISSIL/{System}/{Category}/{ComponentName}/{StoryName}

Examples:
- WISSIL/Landing/Pages/Main Gateway/Default
- WISSIL/Spark/Organisms/PromptInput/WithExamples
- WISSIL/Slate/Molecules/TokenCard/Interactive
- WISSIL/Shared/Atoms/Button/AllVariants
```

---

## Page-by-Page Component Breakdown

### 1. LANDING Page Components

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        LANDING PAGE COMPONENT BREAKDOWN                      │
└─────────────────────────────────────────────────────────────────────────────┘

PAGE LEVEL
└── LandingPage
    ├── Full page implementation
    ├── Stories: Default, WithLayout, Mobile, Tablet, WideScreen
    └── Documentation: landing.mdx

ORGANISMS
├── HeroSection
│   ├── Purpose: Main value proposition
│   ├── Components: Heading, Description, CTAGroup
│   ├── Stories: Default, WithAnimation, Minimal
│   └── Props: title, description, ctaButtons, showAnimation
│
├── SystemsGrid
│   ├── Purpose: Display all WISSIL subsystems
│   ├── Components: SystemCard (x6)
│   ├── Stories: Default, Compact, WithStatus, Loading
│   └── Props: systems, layout, showStatus
│
└── FeaturesSection
    ├── Purpose: Highlight platform benefits
    ├── Components: FeatureCard (x3)
    ├── Stories: Default, Horizontal, WithIcons
    └── Props: features, layout, showIcons

MOLECULES
├── SystemCard
│   ├── Purpose: Individual subsystem card
│   ├── Components: SystemIcon, StatusBadge, GradientButton
│   ├── Stories: Default, Hover, Active, Disabled, Loading
│   └── Props: system, status, onClick, disabled
│
├── FeatureCard
│   ├── Purpose: Feature highlight
│   ├── Components: Icon, Heading, Description
│   ├── Stories: Default, WithIcon, Compact
│   └── Props: icon, title, description, variant
│
└── CTAGroup
    ├── Purpose: Call-to-action buttons
    ├── Components: GradientButton (x2)
    ├── Stories: Default, Stacked, Horizontal
    └── Props: primaryCTA, secondaryCTA, layout

ATOMS
├── GradientButton
│   ├── Purpose: Primary action button
│   ├── Stories: Default, Hover, Active, Disabled, Loading, AllSizes
│   └── Props: variant, size, loading, disabled, onClick
│
├── StatusBadge
│   ├── Purpose: System health indicator
│   ├── Stories: Online, Offline, Warning, Error, Loading
│   └── Props: status, size, showPulse
│
└── SystemIcon
    ├── Purpose: System identifier icon
    ├── Stories: AllSystems, Colored, Monochrome, Animated
    └── Props: system, variant, size, animated
```

### 2. SLATE Page Components

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SLATE PAGE COMPONENT BREAKDOWN                       │
└─────────────────────────────────────────────────────────────────────────────┘

PAGE LEVEL
└── SlatePage
    ├── Full design system explorer
    ├── Stories: Default, WithLayout, Mobile, Tablet
    └── Documentation: slate.mdx

ORGANISMS
├── TokenExplorer
│   ├── Purpose: Browse all design tokens
│   ├── Components: TokenCard grid, FilterBar, SearchInput
│   ├── Stories: Default, Filtered, Search, Categories
│   └── Props: tokens, category, searchQuery, onTokenSelect
│
├── ColorSystemViewer
│   ├── Purpose: Display color system palettes
│   ├── Components: ColorSwatch grid (x6 systems)
│   ├── Stories: Default, SingleSystem, WithValues, Interactive
│   └── Props: system, showValues, interactive
│
└── TypographyScale
    ├── Purpose: Typography scale visualization
    ├── Components: FontSample rows (xs - 9xl)
    ├── Stories: Default, WithWeights, WithLineHeights, Responsive
    └── Props: scale, showWeights, showLineHeights

MOLECULES
├── TokenCard
│   ├── Purpose: Individual token display
│   ├── Components: TokenName, TokenValue, CopyButton
│   ├── Stories: Default, Hover, Copied, WithDescription
│   └── Props: token, value, description, onCopy
│
├── ColorSwatch
│   ├── Purpose: Color value display
│   ├── Components: ColorBox, ColorValue, ColorName
│   ├── Stories: Default, WithHex, WithRGB, WithHSL, Interactive
│   └── Props: color, name, showValues, interactive
│
└── TypographySample
    ├── Purpose: Typography example
    ├── Components: FontSample, SizeLabel, WeightLabel
    ├── Stories: Default, AllSizes, AllWeights, WithSample
    └── Props: size, weight, sample, showLabels

ATOMS
├── ColorBox
│   ├── Purpose: Visual color representation
│   ├── Stories: AllColors, WithBorder, Rounded, Square
│   └── Props: color, size, shape, showBorder
│
├── FontSample
│   ├── Purpose: Typography preview
│   ├── Stories: AllSizes, AllWeights, AllFamilies
│   └── Props: size, weight, family, sample
│
└── SpacingVisualizer
    ├── Purpose: Spacing scale visualization
    ├── Stories: Default, AllSizes, WithLabels, Interactive
    └── Props: size, showLabel, interactive
```

### 3. IGNITION Page Components

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       IGNITION PAGE COMPONENT BREAKDOWN                      │
└─────────────────────────────────────────────────────────────────────────────┘

PAGE LEVEL
└── IgnitionPage
    ├── Project creation wizard
    ├── Stories: Default, WithLayout, Mobile, Tablet
    └── Documentation: ignition.mdx

ORGANISMS
├── TemplateGallery
│   ├── Purpose: Display project templates
│   ├── Components: TemplateCard grid (x3)
│   ├── Stories: Default, Filtered, WithPreview, Loading
│   └── Props: templates, selectedTemplate, onSelect
│
├── ConfigurationWizard
│   ├── Purpose: 5-step project setup
│   ├── Components: WizardStep (x5), StepIndicator, NavigationButtons
│   ├── Stories: Default, Step1, Step2, Step3, Step4, Step5, Complete
│   └── Props: currentStep, steps, onNext, onBack, onComplete
│
└── ProjectPreview
    ├── Purpose: Preview generated project
    ├── Components: FileTree, CodePreview, DependencyList
    ├── Stories: Default, WithCode, WithDependencies, Loading
    └── Props: project, showCode, showDependencies

MOLECULES
├── TemplateCard
│   ├── Purpose: Template selection card
│   ├── Components: TemplateIcon, TemplateName, TemplateDescription, SelectButton
│   ├── Stories: Default, Selected, Hover, WithPreview
│   └── Props: template, selected, onSelect, showPreview
│
├── WizardStep
│   ├── Purpose: Individual wizard step
│   ├── Components: StepIndicator, StepContent, StepActions
│   ├── Stories: Default, Active, Completed, Disabled
│   └── Props: step, active, completed, content
│
└── DependencySelector
    ├── Purpose: Dependency selection
    ├── Components: DependencyBadge list, SearchInput, CategoryFilter
    ├── Stories: Default, WithSearch, Filtered, Selected
    └── Props: dependencies, selected, onToggle, categories

ATOMS
├── TemplateIcon
│   ├── Purpose: Template type icon
│   ├── Stories: NextJS, ComponentLibrary, APIService, AllTypes
│   └── Props: type, size, variant
│
├── StepIndicator
│   ├── Purpose: Wizard step indicator
│   ├── Stories: Default, Active, Completed, Error, AllStates
│   └── Props: step, status, label
│
└── DependencyBadge
    ├── Purpose: Dependency tag
    ├── Stories: Default, Selected, Required, Optional, AllTypes
    └── Props: dependency, selected, required, onToggle
```

### 4. SPARK Page Components

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SPARK PAGE COMPONENT BREAKDOWN                      │
└─────────────────────────────────────────────────────────────────────────────┘

PAGE LEVEL
└── SparkPage
    ├── AI component generator
    ├── Stories: Default, WithLayout, Mobile, Tablet
    └── Documentation: spark.mdx

ORGANISMS
├── PromptInput
│   ├── Purpose: Natural language input
│   ├── Components: TextArea, QuickPrompts, SubmitButton
│   ├── Stories: Default, WithExamples, WithHistory, Loading
│   └── Props: value, onChange, onSubmit, examples, history
│
├── MoEDisplay
│   ├── Purpose: Mixture of Experts visualization
│   ├── Components: ExpertCard (x3), RoutingIndicator, StatusBadges
│   ├── Stories: Default, AllExperts, SingleExpert, Routing, Active
│   └── Props: experts, activeExpert, routing, status
│
├── CodeOutput
│   ├── Purpose: Generated code display
│   ├── Components: CodeEditor, TabBar, CopyButton, SaveButton
│   ├── Stories: Default, WithTabs, WithActions, Loading, Error
│   └── Props: code, tabs, onCopy, onSave, loading, error
│
└── PreviewPanel
    ├── Purpose: Live component preview
    ├── Components: PreviewFrame, RefreshButton, FullscreenButton
    ├── Stories: Default, Loading, Error, Fullscreen, Responsive
    └── Props: code, loading, error, onRefresh, fullscreen

MOLECULES
├── ExpertCard
│   ├── Purpose: AI expert visualization
│   ├── Components: AIBadge, ExpertName, ExpertDescription, StatusIndicator
│   ├── Stories: Default, Active, Inactive, Processing, AllExperts
│   └── Props: expert, active, processing, status
│
├── CodeEditor
│   ├── Purpose: Code display/editing
│   ├── Components: MonacoEditor, SyntaxHighlighting, LineNumbers
│   ├── Stories: Default, ReadOnly, Editable, WithErrors, WithWarnings
│   └── Props: code, language, readOnly, onChange, errors, warnings
│
└── QuickPrompt
    ├── Purpose: Pre-built prompt button
    ├── Components: Button, Icon, Description
    ├── Stories: Default, Hover, Selected, AllPrompts
    └── Props: prompt, onClick, selected

ATOMS
├── AIBadge
│   ├── Purpose: AI indicator badge
│   ├── Stories: Default, Pulsing, AllVariants
│   └── Props: variant, pulsing, size
│
├── CodeBlock
│   ├── Purpose: Syntax-highlighted code
│   ├── Stories: Default, AllLanguages, WithLineNumbers, WithCopy
│   └── Props: code, language, showLineNumbers, onCopy
│
└── LoadingSpinner
    ├── Purpose: Loading indicator
    ├── Stories: Default, Small, Large, WithText, AllVariants
    └── Props: size, text, variant
```

### 5. IGNIS Page Components

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          IGNIS PAGE COMPONENT BREAKDOWN                       │
└─────────────────────────────────────────────────────────────────────────────┘

PAGE LEVEL
└── IgnisPage
    ├── Build pipeline interface
    ├── Stories: Default, WithLayout, Mobile, Tablet
    └── Documentation: ignis.mdx

ORGANISMS
├── BuildMetrics
│   ├── Purpose: Build performance metrics
│   ├── Components: MetricCard grid (x4), Chart, Summary
│   ├── Stories: Default, WithChart, Loading, Error, AllMetrics
│   └── Props: metrics, loading, error, timeRange
│
├── OptimizationPanel
│   ├── Purpose: Build optimization controls
│   ├── Components: OptimizationToggle (x4), ImpactIndicator, ApplyButton
│   ├── Stories: Default, AllEnabled, AllDisabled, Custom, WithImpact
│   └── Props: optimizations, enabled, onChange, onApply
│
└── BuildHistory
    ├── Purpose: Build history timeline
    ├── Components: HistoryItem list, FilterBar, Pagination
    ├── Stories: Default, Filtered, WithDetails, Loading, Empty
    └── Props: builds, filter, onFilter, onSelect

MOLECULES
├── MetricCard
│   ├── Purpose: Individual metric display
│   ├── Components: MetricValue, MetricLabel, TrendIndicator
│   ├── Stories: Default, WithTrend, Loading, Error, AllMetrics
│   └── Props: metric, value, trend, loading, error
│
├── OptimizationToggle
│   ├── Purpose: Optimization enable/disable
│   ├── Components: Toggle, Label, Description, ImpactBadge
│   ├── Stories: Default, Enabled, Disabled, WithImpact, AllOptimizations
│   └── Props: optimization, enabled, impact, onChange
│
└── HistoryItem
    ├── Purpose: Build history entry
    ├── Components: StatusIcon, BuildInfo, Actions, Timestamp
    ├── Stories: Default, Success, Error, Warning, Loading, WithDetails
    └── Props: build, status, onSelect, onRerun

ATOMS
├── ProgressBar
│   ├── Purpose: Build progress indicator
│   ├── Stories: Default, Loading, Complete, Error, AllStates
│   └── Props: progress, status, showLabel, animated
│
├── MetricValue
│   ├── Purpose: Metric value display
│   ├── Stories: Default, Large, Small, WithUnit, WithTrend
│   └── Props: value, unit, trend, size
│
└── StatusIcon
    ├── Purpose: Build status indicator
    ├── Stories: Success, Error, Warning, Loading, AllStates
    └── Props: status, size, animated
```

### 6. WAYPOINT Page Components

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        WAYPOINT PAGE COMPONENT BREAKDOWN                     │
└─────────────────────────────────────────────────────────────────────────────┘

PAGE LEVEL
└── WaypointPage
    ├── Unity visual scripting interface
    ├── Stories: Default, WithLayout, Mobile, Tablet
    └── Documentation: waypoint.mdx

ORGANISMS
├── GraphEditor
│   ├── Purpose: Node graph canvas
│   ├── Components: Canvas, NodeCard list, ConnectionLine list, Toolbar
│   ├── Stories: Default, WithNodes, WithConnections, Empty, Loading
│   └── Props: nodes, connections, onNodeAdd, onNodeMove, onConnect
│
├── NodeInspector
│   ├── Purpose: Selected node properties
│   ├── Components: NodeHeader, PropertyEditor list, Actions
│   ├── Stories: Default, WithProperties, Editing, NoSelection
│   └── Props: node, onPropertyChange, onDelete, onDuplicate
│
└── NodeRegistry
    ├── Purpose: Available nodes library
    ├── Components: NodeCard grid, CategoryFilter, SearchInput
    ├── Stories: Default, Filtered, Search, Categories, WithPreview
    └── Props: nodes, categories, selectedCategory, onNodeSelect

MOLECULES
├── NodeCard
│   ├── Purpose: Visual node representation
│   ├── Components: NodeIcon, NodeName, NodePorts, NodeActions
│   ├── Stories: Default, Selected, Hover, Dragging, AllTypes
│   └── Props: node, selected, onSelect, onDrag, onDelete
│
├── ConnectionLine
│   ├── Purpose: Node connection visualization
│   ├── Components: SVG path, ConnectionPoints
│   ├── Stories: Default, Active, Hover, Error, AllStates
│   └── Props: from, to, active, error, onHover
│
└── PropertyEditor
    ├── Purpose: Node property input
    ├── Components: PropertyLabel, Input, TypeIndicator
    ├── Stories: Default, String, Number, Boolean, Enum, AllTypes
    └── Props: property, value, onChange, type

ATOMS
├── NodePort
│   ├── Purpose: Connection point
│   ├── Stories: Default, Input, Output, Connected, Hover, AllTypes
│   └── Props: type, connected, onConnect, onHover
│
├── NodeIcon
│   ├── Purpose: Node type icon
│   ├── Stories: AllTypes, Colored, Monochrome, Animated
│   └── Props: type, variant, size, animated
│
└── ConnectionPoint
    ├── Purpose: Connection endpoint
    ├── Stories: Default, Input, Output, Connected, Hover, AllStates
    └── Props: type, connected, onConnect, onHover
```

---

## Story Organization Patterns

### Story File Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        STORY FILE STRUCTURE PATTERN                          │
└─────────────────────────────────────────────────────────────────────────────┘

{ComponentName}.stories.tsx
│
├── Meta Configuration
│   ├── title: 'WISSIL/{System}/{Category}/{ComponentName}'
│   ├── component: ComponentName
│   ├── parameters: { layout, backgrounds, viewport, docs }
│   ├── tags: ['autodocs']
│   └── argTypes: { ...props }
│
├── Default Story
│   ├── render: () => <Component />
│   └── args: { defaultProps }
│
├── Variant Stories
│   ├── WithLayout
│   ├── Mobile
│   ├── Tablet
│   └── WideScreen
│
├── State Stories
│   ├── Loading
│   ├── Error
│   ├── Empty
│   └── Disabled
│
├── Interaction Stories
│   ├── Interactive
│   ├── WithActions
│   └── WithControls
│
└── Accessibility Stories
    ├── A11yCheck
    ├── KeyboardNavigation
    └── ScreenReader
```

### Story Categories

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            STORY CATEGORIES                                   │
└─────────────────────────────────────────────────────────────────────────────┘

1. BASE STORIES
   ├── Default: Standard component render
   ├── WithLayout: Wrapped in WISSILLayout
   └── Standalone: Without any wrapper

2. VIEWPORT STORIES
   ├── Mobile: 375x667 (iPhone)
   ├── Tablet: 768x1024 (iPad)
   ├── Desktop: 1920x1080
   └── WideScreen: 2560x1440

3. STATE STORIES
   ├── Loading: Loading state
   ├── Error: Error state
   ├── Empty: Empty state
   ├── Disabled: Disabled state
   └── Success: Success state

4. INTERACTION STORIES
   ├── Interactive: Full interactivity
   ├── WithActions: Action logging
   ├── WithControls: Storybook controls
   └── PlayFunction: Automated interactions

5. VARIANT STORIES
   ├── AllVariants: All style variants
   ├── AllSizes: All size variants
   ├── AllColors: All color variants
   └── AllStates: All state variants

6. ACCESSIBILITY STORIES
   ├── A11yCheck: Automated a11y tests
   ├── KeyboardNavigation: Keyboard only
   ├── ScreenReader: Screen reader test
   └── ColorContrast: Contrast validation
```

---

## Visual Flowcharts

### Component Development Flowchart

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    COMPONENT DEVELOPMENT FLOWCHART                            │
└─────────────────────────────────────────────────────────────────────────────┘

                    START: New Component
                           │
                           ▼
            ┌──────────────────────────────┐
            │  Determine Component Level    │
            │  (Atom/Molecule/Organism)     │
            └──────────────┬───────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│    ATOM      │  │   MOLECULE   │  │   ORGANISM   │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                  │
       │                 │                  │
       └─────────────────┼──────────────────┘
                        │
                        ▼
            ┌──────────────────────────────┐
            │  Create Component File       │
            │  {ComponentName}.tsx         │
            └──────────────┬───────────────┘
                           │
                           ▼
            ┌──────────────────────────────┐
            │  Create Story File           │
            │  {ComponentName}.stories.tsx │
            └──────────────┬───────────────┘
                           │
                           ▼
            ┌──────────────────────────────┐
            │  Add Base Stories             │
            │  - Default                    │
            │  - WithLayout                 │
            │  - Viewport variants          │
            └──────────────┬───────────────┘
                           │
                           ▼
            ┌──────────────────────────────┐
            │  Add State Stories            │
            │  - Loading                    │
            │  - Error                      │
            │  - Empty                      │
            └──────────────┬───────────────┘
                           │
                           ▼
            ┌──────────────────────────────┐
            │  Add Interaction Stories     │
            │  - Interactive                │
            │  - WithActions               │
            │  - PlayFunction               │
            └──────────────┬───────────────┘
                           │
                           ▼
            ┌──────────────────────────────┐
            │  Add Accessibility Stories   │
            │  - A11yCheck                 │
            │  - KeyboardNavigation        │
            └──────────────┬───────────────┘
                           │
                           ▼
            ┌──────────────────────────────┐
            │  Create MDX Documentation    │
            │  {ComponentName}.mdx         │
            └──────────────┬───────────────┘
                           │
                           ▼
            ┌──────────────────────────────┐
            │  Test in Storybook            │
            │  - Visual review              │
            │  - Interaction test            │
            │  - Accessibility test          │
            └──────────────┬───────────────┘
                           │
                           ▼
            ┌──────────────────────────────┐
            │  Integrate into Page          │
            │  Update page component        │
            └──────────────┬───────────────┘
                           │
                           ▼
                       COMPLETE
```

### Story Organization Flowchart

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      STORY ORGANIZATION FLOWCHART                            │
└─────────────────────────────────────────────────────────────────────────────┘

                    Component Created
                           │
                           ▼
            ┌──────────────────────────────┐
            │  Determine Story Location     │
            │  WISSIL/{System}/{Category}/  │
            └──────────────┬───────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Shared/    │  │  {System}/   │  │  {System}/   │
│   Atoms/     │  │  Molecules/   │  │  Organisms/  │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                  │
       └─────────────────┼──────────────────┘
                        │
                        ▼
            ┌──────────────────────────────┐
            │  Create Story File           │
            │  Following naming convention │
            └──────────────┬───────────────┘
                           │
                           ▼
            ┌──────────────────────────────┐
            │  Add Meta Configuration      │
            │  - title                     │
            │  - component                 │
            │  - parameters                │
            │  - argTypes                  │
            └──────────────┬───────────────┘
                           │
                           ▼
            ┌──────────────────────────────┐
            │  Create Base Stories          │
            │  - Default                   │
            │  - WithLayout                │
            └──────────────┬───────────────┘
                           │
                           ▼
            ┌──────────────────────────────┐
            │  Add Viewport Stories        │
            │  - Mobile                    │
            │  - Tablet                    │
            │  - Desktop                   │
            └──────────────┬───────────────┘
                           │
                           ▼
            ┌──────────────────────────────┐
            │  Add State Stories           │
            │  Based on component props    │
            └──────────────┬───────────────┘
                           │
                           ▼
            ┌──────────────────────────────┐
            │  Add Interaction Stories    │
            │  - Interactive               │
            │  - WithActions               │
            └──────────────┬───────────────┘
                           │
                           ▼
            ┌──────────────────────────────┐
            │  Add Accessibility Stories   │
            │  - A11yCheck                │
            │  - KeyboardNavigation        │
            └──────────────┬───────────────┘
                           │
                           ▼
            ┌──────────────────────────────┐
            │  Verify in Storybook         │
            │  - All stories render        │
            │  - Controls work             │
            │  - Docs generated            │
            └──────────────┬───────────────┘
                           │
                           ▼
                       COMPLETE
```

---

## Component Hierarchy Diagrams

### LANDING Page Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    LANDING PAGE COMPONENT HIERARCHY                          │
└─────────────────────────────────────────────────────────────────────────────┘

LandingPage (Page)
│
├── HeroSection (Organism)
│   ├── Heading (Atom - Text)
│   ├── Description (Atom - Text)
│   └── CTAGroup (Molecule)
│       ├── GradientButton (Atom) - Primary
│       └── GradientButton (Atom) - Secondary
│
├── SystemsGrid (Organism)
│   ├── SystemCard (Molecule) × 6
│   │   ├── SystemIcon (Atom)
│   │   ├── StatusBadge (Atom)
│   │   ├── SystemName (Atom - Text)
│   │   ├── SystemDescription (Atom - Text)
│   │   └── GradientButton (Atom) - Navigate
│   │
│   └── GridLayout (Template)
│
└── FeaturesSection (Organism)
    ├── FeatureCard (Molecule) × 3
    │   ├── Icon (Atom)
    │   ├── FeatureTitle (Atom - Text)
    │   └── FeatureDescription (Atom - Text)
    │
    └── SectionLayout (Template)

Shared Components:
├── WISSILLayout (Template)
│   ├── Header (Organism)
│   ├── BackgroundEffects (Molecule)
│   └── SystemBadge (Atom)
│
└── Navigation (Organism)
    ├── NavLink (Molecule) × N
    └── Logo (Atom)
```

### SPARK Page Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     SPARK PAGE COMPONENT HIERARCHY                            │
└─────────────────────────────────────────────────────────────────────────────┘

SparkPage (Page)
│
├── PromptInput (Organism)
│   ├── TextArea (Atom - Input)
│   ├── QuickPrompts (Molecule)
│   │   └── QuickPrompt (Molecule) × N
│   │       └── Button (Atom)
│   │
│   └── SubmitButton (Atom - Button)
│
├── MoEDisplay (Organism)
│   ├── ExpertCard (Molecule) × 3
│   │   ├── AIBadge (Atom)
│   │   ├── ExpertName (Atom - Text)
│   │   ├── ExpertDescription (Atom - Text)
│   │   └── StatusIndicator (Atom)
│   │
│   └── RoutingIndicator (Molecule)
│
├── CodeOutput (Organism)
│   ├── TabBar (Molecule)
│   │   └── Tab (Atom) × N
│   │
│   ├── CodeEditor (Molecule)
│   │   └── CodeBlock (Atom)
│   │
│   └── ActionBar (Molecule)
│       ├── CopyButton (Atom - Button)
│       └── SaveButton (Atom - Button)
│
└── PreviewPanel (Organism)
    ├── PreviewFrame (Molecule)
    ├── RefreshButton (Atom - Button)
    └── FullscreenButton (Atom - Button)

Shared Components:
└── LoadingSpinner (Atom) - Used in multiple organisms
```

### SLATE Page Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     SLATE PAGE COMPONENT HIERARCHY                           │
└─────────────────────────────────────────────────────────────────────────────┘

SlatePage (Page)
│
├── TokenExplorer (Organism)
│   ├── FilterBar (Molecule)
│   │   ├── SearchInput (Atom - Input)
│   │   └── CategoryFilter (Molecule)
│   │       └── FilterButton (Atom - Button) × N
│   │
│   └── TokenGrid (Template)
│       └── TokenCard (Molecule) × N
│           ├── TokenName (Atom - Text)
│           ├── TokenValue (Atom - Text)
│           ├── CopyButton (Atom - Button)
│           └── TokenDescription (Atom - Text)
│
├── ColorSystemViewer (Organism)
│   └── ColorGrid (Template)
│       └── ColorSwatch (Molecule) × N
│           ├── ColorBox (Atom)
│           ├── ColorName (Atom - Text)
│           └── ColorValue (Atom - Text)
│
└── TypographyScale (Organism)
    └── TypographyList (Template)
        └── TypographySample (Molecule) × N
            ├── FontSample (Atom)
            ├── SizeLabel (Atom - Text)
            └── WeightLabel (Atom - Text)
```

---

## Story Organization Mindmaps

### Complete Storybook Organization Mindmap

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                  STORYBOOK ORGANIZATION MINDMAP                              │
└─────────────────────────────────────────────────────────────────────────────┘

                                    Storybook
                                        │
        ┌───────────────────────────────┼───────────────────────────────┐
        │                               │                               │
    WISSIL/                         Shared/                      Documentation/
        │                               │                               │
        ├── Landing                     ├── Layouts                    ├── Getting Started
        │   ├── Pages                   │   └── WISSILLayout           ├── Component Guide
        │   ├── Organisms               │                               ├── Design Tokens
        │   │   ├── HeroSection         ├── Atoms                       └── Best Practices
        │   │   ├── SystemsGrid        │   ├── Button
        │   │   └── FeaturesSection    │   ├── Input
        │   │                           │   ├── Badge
        │   ├── Molecules              │   └── Icon
        │   │   ├── SystemCard         │
        │   │   ├── FeatureCard        └── Molecules
        │   │   └── CTAGroup               ├── Card
        │   │                               ├── Modal
        │   └── Atoms                    └── Tooltip
        │       ├── GradientButton
        │       ├── StatusBadge
        │       └── SystemIcon
        │
        ├── Slate
        │   ├── Pages
        │   ├── Organisms
        │   │   ├── TokenExplorer
        │   │   ├── ColorSystemViewer
        │   │   └── TypographyScale
        │   ├── Molecules
        │   │   ├── TokenCard
        │   │   ├── ColorSwatch
        │   │   └── TypographySample
        │   └── Atoms
        │       ├── ColorBox
        │       ├── FontSample
        │       └── SpacingVisualizer
        │
        ├── Ignition
        │   ├── Pages
        │   ├── Organisms
        │   │   ├── TemplateGallery
        │   │   ├── ConfigurationWizard
        │   │   └── ProjectPreview
        │   ├── Molecules
        │   │   ├── TemplateCard
        │   │   ├── WizardStep
        │   │   └── DependencySelector
        │   └── Atoms
        │       ├── TemplateIcon
        │       ├── StepIndicator
        │       └── DependencyBadge
        │
        ├── Spark
        │   ├── Pages
        │   ├── Organisms
        │   │   ├── PromptInput
        │   │   ├── MoEDisplay
        │   │   ├── CodeOutput
        │   │   └── PreviewPanel
        │   ├── Molecules
        │   │   ├── ExpertCard
        │   │   ├── CodeEditor
        │   │   └── QuickPrompt
        │   └── Atoms
        │       ├── AIBadge
        │       ├── CodeBlock
        │       └── LoadingSpinner
        │
        ├── Ignis
        │   ├── Pages
        │   ├── Organisms
        │   │   ├── BuildMetrics
        │   │   ├── OptimizationPanel
        │   │   └── BuildHistory
        │   ├── Molecules
        │   │   ├── MetricCard
        │   │   ├── OptimizationToggle
        │   │   └── HistoryItem
        │   └── Atoms
        │       ├── ProgressBar
        │       ├── MetricValue
        │       └── StatusIcon
        │
        └── Waypoint
            ├── Pages
            ├── Organisms
            │   ├── GraphEditor
            │   ├── NodeInspector
            │   └── NodeRegistry
            ├── Molecules
            │   ├── NodeCard
            │   ├── ConnectionLine
            │   └── PropertyEditor
            └── Atoms
                ├── NodePort
                ├── NodeIcon
                └── ConnectionPoint
```

### Component Story Types Mindmap

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    COMPONENT STORY TYPES MINDMAP                             │
└─────────────────────────────────────────────────────────────────────────────┘

                            Component Stories
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
    BASE STORIES              VARIANT STORIES            STATE STORIES
        │                           │                           │
        ├── Default                 ├── WithLayout             ├── Loading
        ├── Standalone              ├── Mobile                  ├── Error
        └── Minimal                 ├── Tablet                 ├── Empty
                                    ├── Desktop                 ├── Disabled
                                    └── WideScreen              └── Success
        │                           │                           │
        │                           │                           │
INTERACTION STORIES         ACCESSIBILITY STORIES      DOCUMENTATION
        │                           │                           │
        ├── Interactive             ├── A11yCheck              ├── MDX Docs
        ├── WithActions              ├── KeyboardNavigation     ├── Props Table
        ├── WithControls             ├── ScreenReader          ├── Examples
        └── PlayFunction             └── ColorContrast         └── Usage Guide
```

---

## UI/UX Function Mapping

### Function to Component Mapping

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      UI/UX FUNCTION MAPPING                                  │
└─────────────────────────────────────────────────────────────────────────────┘

FUNCTION: Navigation
├── Components: NavLink, Logo, Breadcrumb
├── Stories: WISSIL/Shared/Molecules/NavLink
└── Usage: All pages

FUNCTION: User Input
├── Components: Input, TextArea, Select, Checkbox, Radio
├── Stories: WISSIL/Shared/Atoms/Input
└── Usage: Forms, search, configuration

FUNCTION: Actions
├── Components: Button, GradientButton, IconButton
├── Stories: WISSIL/Shared/Atoms/Button, WISSIL/Landing/Atoms/GradientButton
└── Usage: CTAs, form submissions, interactions

FUNCTION: Feedback
├── Components: StatusBadge, LoadingSpinner, ProgressBar, Alert
├── Stories: WISSIL/Landing/Atoms/StatusBadge, WISSIL/Spark/Atoms/LoadingSpinner
└── Usage: Status indicators, loading states, notifications

FUNCTION: Data Display
├── Components: Card, Table, List, Grid
├── Stories: WISSIL/Shared/Molecules/Card
└── Usage: Content organization, data presentation

FUNCTION: Code Display
├── Components: CodeBlock, CodeEditor, SyntaxHighlighting
├── Stories: WISSIL/Spark/Atoms/CodeBlock, WISSIL/Spark/Molecules/CodeEditor
└── Usage: Code generation, preview, editing

FUNCTION: Visualization
├── Components: Chart, Graph, NodeGraph, ColorSwatch
├── Stories: WISSIL/Ignis/Organisms/BuildMetrics, WISSIL/Waypoint/Organisms/GraphEditor
└── Usage: Metrics, graphs, design tokens

FUNCTION: Modals & Overlays
├── Components: Modal, Dialog, Tooltip, Popover
├── Stories: WISSIL/Shared/Molecules/Modal
└── Usage: Confirmations, details, help

FUNCTION: Forms & Wizards
├── Components: Form, Wizard, StepIndicator, FieldGroup
├── Stories: WISSIL/Ignition/Organisms/ConfigurationWizard
└── Usage: Multi-step processes, data entry

FUNCTION: Search & Filter
├── Components: SearchInput, FilterBar, CategoryFilter
├── Stories: WISSIL/Slate/Organisms/TokenExplorer
└── Usage: Finding content, filtering data
```

### Page Function Matrix

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PAGE FUNCTION MATRIX                                 │
└─────────────────────────────────────────────────────────────────────────────┘

Function              │ Landing │ Slate │ Ignition │ Spark │ Ignis │ Waypoint
──────────────────────┼─────────┼───────┼──────────┼───────┼───────┼──────────
Navigation            │    ✓    │   ✓   │    ✓     │   ✓   │   ✓   │    ✓
User Input            │    -    │   ✓   │    ✓     │   ✓   │   ✓   │    ✓
Actions (Buttons)     │    ✓    │   ✓   │    ✓     │   ✓   │   ✓   │    ✓
Feedback (Status)     │    ✓    │   -   │    -     │   ✓   │   ✓   │    ✓
Data Display          │    ✓    │   ✓   │    ✓     │   ✓   │   ✓   │    ✓
Code Display          │    -    │   -   │    -     │   ✓   │   -   │    -
Visualization         │    -    │   ✓   │    -     │   -   │   ✓   │    ✓
Modals & Overlays     │    -    │   -   │    ✓     │   ✓   │   -   │    ✓
Forms & Wizards       │    -    │   -   │    ✓     │   -   │   -   │    -
Search & Filter       │    -    │   ✓   │    ✓     │   -   │   ✓   │    ✓
Real-time Updates     │    ✓    │   -   │    -     │   ✓   │   ✓   │    ✓
Graph/Node Editor     │    -    │   -   │    -     │   -   │   -   │    ✓
```

---

## Best Practices & Guidelines

### Story Creation Guidelines

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      STORY CREATION GUIDELINES                               │
└─────────────────────────────────────────────────────────────────────────────┘

1. NAMING CONVENTIONS
   ├── Story files: {ComponentName}.stories.tsx
   ├── Story titles: WISSIL/{System}/{Category}/{ComponentName}
   └── Story names: PascalCase (e.g., Default, WithLayout, Mobile)

2. REQUIRED STORIES
   ├── Default: Basic component render
   ├── WithLayout: Wrapped in WISSILLayout
   ├── Mobile: Mobile viewport (375x667)
   ├── Tablet: Tablet viewport (768x1024)
   └── Desktop: Desktop viewport (1920x1080)

3. OPTIONAL STORIES
   ├── Loading: Loading state
   ├── Error: Error state
   ├── Empty: Empty state
   ├── Interactive: Full interactivity
   └── A11yCheck: Accessibility validation

4. STORY PARAMETERS
   ├── layout: 'fullscreen' for pages, 'centered' for atoms
   ├── backgrounds: Match system color
   ├── viewport: Responsive variants
   └── docs: Component description

5. ARGTYPES
   ├── All props should have argTypes
   ├── Controls for interactive props
   ├── Actions for event handlers
   └── Documentation for each prop

6. ACCESSIBILITY
   ├── Include A11yCheck story
   ├── Test keyboard navigation
   ├── Verify ARIA labels
   └── Check color contrast

7. DOCUMENTATION
   ├── MDX file for complex components
   ├── Inline comments in stories
   ├── Usage examples
   └── Integration notes
```

### Component Organization Rules

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    COMPONENT ORGANIZATION RULES                               │
└─────────────────────────────────────────────────────────────────────────────┘

1. ATOMIC DESIGN ENFORCEMENT
   ├── Atoms cannot contain other components
   ├── Molecules can only contain atoms
   ├── Organisms can contain molecules and atoms
   └── Pages can contain all levels

2. FILE STRUCTURE
   ├── One component per file
   ├── Co-located stories (.stories.tsx)
   ├── Co-located tests (.test.tsx)
   └── Co-located types (.types.ts)

3. SHARED COMPONENTS
   ├── Place in WISSIL/Shared/
   ├── Used across multiple systems
   ├── Generic, reusable components
   └── Well-documented APIs

4. SYSTEM-SPECIFIC COMPONENTS
   ├── Place in WISSIL/{System}/
   ├── Unique to that system
   ├── System-colored variants
   └── System-specific functionality

5. STORY GROUPING
   ├── Group by component level
   ├── Group by functionality
   ├── Group by system
   └── Consistent naming

6. DOCUMENTATION
   ├── Every component has stories
   ├── Complex components have MDX
   ├── All props documented
   └── Usage examples provided
```

### Storybook Configuration

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    STORYBOOK CONFIGURATION                                   │
└─────────────────────────────────────────────────────────────────────────────┘

.storybook/main.ts
├── Stories pattern: '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'
├── MDX pattern: '../src/**/*.mdx'
├── Addons: Essentials, Interactions, A11y, Viewport, Controls
└── Framework: @storybook/nextjs

.storybook/preview.ts
├── Global decorators: WISSILLayout wrapper
├── Global parameters: Layout, backgrounds, viewport
├── Theme configuration: Dark mode default
└── Global styles: Tailwind CSS, SLATE tokens

Viewport Presets
├── Mobile: 375x667 (iPhone)
├── Tablet: 768x1024 (iPad)
├── Desktop: 1920x1080
└── WideScreen: 2560x1440

Background Presets
├── Dark: #0A0A0A (default)
├── Light: #FFFFFF
└── System: Match system color
```

---

## Summary

This comprehensive guide provides:

1. **Complete Storybook Structure**: Organization for all 6 WISSIL pages
2. **Component Breakdown**: Detailed breakdown of all components per page
3. **Story Organization**: Patterns and conventions for story creation
4. **Visual Diagrams**: Flowcharts, hierarchies, and mindmaps
5. **Function Mapping**: UI/UX functions to components
6. **Best Practices**: Guidelines for maintaining consistency

### Key Takeaways

- **Atomic Design**: Follow strict hierarchy (Atoms → Molecules → Organisms → Templates → Pages)
- **Consistent Naming**: Use WISSIL/{System}/{Category}/{ComponentName} pattern
- **Comprehensive Stories**: Include base, variant, state, interaction, and accessibility stories
- **Documentation**: Every component should have stories and MDX docs
- **Accessibility**: All components must include a11y stories and tests

This organization ensures maintainability, discoverability, and comprehensive documentation of all WISSIL UI/UX components and functions.

---

**Document Version:** 1.0.0
**Last Updated:** December 2024
**Maintained By:** WISSIL Design System Team
