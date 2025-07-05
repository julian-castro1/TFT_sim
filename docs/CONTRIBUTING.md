# Contributing Guide

Thank you for your interest in contributing to the TFT Display Simulator! This guide will help you understand how to contribute effectively to the project.

## 📋 Table of Contents

1. [Getting Started](#getting-started)
2. [Development Setup](#development-setup)
3. [Project Structure](#project-structure)
4. [Coding Standards](#coding-standards)
5. [Testing Guidelines](#testing-guidelines)
6. [Submitting Changes](#submitting-changes)
7. [Issue Guidelines](#issue-guidelines)
8. [Pull Request Process](#pull-request-process)
9. [Code Review Process](#code-review-process)
10. [Release Process](#release-process)

## 🚀 Getting Started

### Prerequisites

Before you start contributing, ensure you have:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **Git** for version control
- **VS Code** (recommended) with the following extensions:
  - TypeScript and JavaScript Language Features
  - ESLint
  - Prettier
  - Jest Runner

### First Time Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/tft-display-simulator.git
   cd tft-display-simulator
   ```

3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/originalowner/tft-display-simulator.git
   ```

4. **Install dependencies**:
   ```bash
   npm install
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Run tests** to ensure everything works:
   ```bash
   npm test
   ```

## 🛠️ Development Setup

### Environment Configuration

Create a `.env.local` file in the root directory:

```env
VITE_APP_NAME=TFT Display Simulator
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=debug
VITE_API_BASE_URL=http://localhost:3000
```

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format
```

## 📁 Project Structure

Understanding the project structure will help you navigate and contribute effectively:

```
tft-display-simulator/
├── src/
│   ├── components/          # React components
│   │   ├── Display/        # Display-related components
│   │   ├── Editor/         # Code editor components
│   │   ├── Controls/       # Control panel components
│   │   └── common/         # Shared components
│   ├── hooks/              # Custom React hooks
│   ├── parsers/            # Arduino code parsing logic
│   ├── renderers/          # Canvas rendering logic
│   ├── stores/             # State management (Zustand)
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript type definitions
│   └── assets/             # Static assets
├── tests/                  # Test files
├── docs/                   # Documentation
├── public/                 # Public assets
└── tools/                  # Development tools
```

### Key Directories

- **`src/parsers/`**: Contains Arduino code parsing logic
- **`src/renderers/`**: Canvas rendering and UI element drawing
- **`src/components/`**: React components for the UI
- **`src/stores/`**: State management using Zustand
- **`src/types/`**: TypeScript interfaces and types
- **`tests/`**: Unit tests, integration tests, and test utilities

## 📝 Coding Standards

### TypeScript Guidelines

- **Use TypeScript for all new code**
- **Define interfaces for all data structures**
- **Use strict type checking**
- **Avoid `any` type when possible**

```typescript
// Good
interface DisplayConfig {
  width: number;
  height: number;
  pixelRatio: number;
}

// Bad
const config: any = { width: 480, height: 320 };
```

### Code Style

We use **ESLint** and **Prettier** for code formatting. The configuration is in `.eslintrc.js` and `.prettierrc`.

#### Key Style Rules:

- **Use 2 spaces** for indentation
- **Use single quotes** for strings
- **Always use semicolons**
- **Use camelCase** for variables and functions
- **Use PascalCase** for classes and interfaces
- **Use UPPER_CASE** for constants

```typescript
// Good
const MAX_WIDTH = 480;
const displayConfig: DisplayConfig = {
  width: MAX_WIDTH,
  height: 320,
  pixelRatio: 1
};

// Bad
const max_width = 480;
const display_config = {
  Width: max_width,
  Height: 320,
  pixel_ratio: 1
}
```

### React Component Guidelines

- **Use functional components** with hooks
- **Use TypeScript interfaces** for props
- **Use custom hooks** for shared logic
- **Keep components small** and focused
- **Use descriptive names**

```typescript
// Good
interface DisplayCanvasProps {
  width: number;
  height: number;
  onTouch: (x: number, y: number) => void;
}

const DisplayCanvas: React.FC<DisplayCanvasProps> = ({ width, height, onTouch }) => {
  // Component logic
};

// Bad
const Canvas = (props: any) => {
  // Component logic
};
```

### File Naming Conventions

- **Components**: `PascalCase.tsx` (e.g., `DisplayCanvas.tsx`)
- **Hooks**: `camelCase.ts` (e.g., `useDisplayStore.ts`)
- **Utilities**: `camelCase.ts` (e.g., `colorUtils.ts`)
- **Types**: `PascalCase.ts` (e.g., `DisplayTypes.ts`)
- **Tests**: `*.test.ts` or `*.spec.ts`

## 🧪 Testing Guidelines

### Testing Framework

We use **Jest** and **React Testing Library** for testing.

### Test Structure

```
tests/
├── unit/                   # Unit tests
│   ├── parsers/           # Parser tests
│   ├── renderers/         # Renderer tests
│   └── utils/             # Utility tests
├── integration/           # Integration tests
├── e2e/                   # End-to-end tests
└── __mocks__/            # Mock files
```

### Writing Tests

#### Unit Tests

```typescript
// colorUtils.test.ts
import { rgbToHex, parseColor } from '../src/utils/colorUtils';

describe('colorUtils', () => {
  describe('rgbToHex', () => {
    it('should convert RGB to hex correctly', () => {
      expect(rgbToHex(255, 0, 0)).toBe('#FF0000');
      expect(rgbToHex(0, 255, 0)).toBe('#00FF00');
      expect(rgbToHex(0, 0, 255)).toBe('#0000FF');
    });
  });

  describe('parseColor', () => {
    it('should parse TFT color constants', () => {
      expect(parseColor('TFT_RED')).toBe('#F800');
      expect(parseColor('TFT_GREEN')).toBe('#07E0');
      expect(parseColor('TFT_BLUE')).toBe('#001F');
    });
  });
});
```

#### Component Tests

```typescript
// DisplayCanvas.test.tsx
import { render, fireEvent } from '@testing-library/react';
import DisplayCanvas from '../src/components/DisplayCanvas';

describe('DisplayCanvas', () => {
  it('should render with correct dimensions', () => {
    const { container } = render(
      <DisplayCanvas width={480} height={320} onTouch={() => {}} />
    );
    
    const canvas = container.querySelector('canvas');
    expect(canvas).toHaveAttribute('width', '480');
    expect(canvas).toHaveAttribute('height', '320');
  });

  it('should call onTouch when clicked', () => {
    const mockOnTouch = jest.fn();
    const { container } = render(
      <DisplayCanvas width={480} height={320} onTouch={mockOnTouch} />
    );
    
    const canvas = container.querySelector('canvas')!;
    fireEvent.click(canvas, { clientX: 100, clientY: 50 });
    
    expect(mockOnTouch).toHaveBeenCalledWith(100, 50);
  });
});
```

### Test Coverage

- **Aim for 80%+ code coverage**
- **Test all public APIs**
- **Test error conditions**
- **Test edge cases**

## 📤 Submitting Changes

### Workflow

1. **Create a new branch** for your feature/fix:
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make your changes** following the coding standards

3. **Write tests** for your changes

4. **Run tests** to ensure nothing is broken:
   ```bash
   npm test
   ```

5. **Lint and format** your code:
   ```bash
   npm run lint
   npm run format
   ```

6. **Commit your changes** with a descriptive message:
   ```bash
   git commit -m "feat: add amazing feature for display rendering"
   ```

7. **Push to your fork**:
   ```bash
   git push origin feature/amazing-feature
   ```

8. **Create a Pull Request** on GitHub

### Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

#### Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

#### Examples:
```
feat(parser): add support for bitmap parsing
fix(renderer): correct touch zone positioning
docs(api): update API documentation
test(parser): add tests for state analysis
```

## 🐛 Issue Guidelines

### Before Creating an Issue

1. **Search existing issues** to avoid duplicates
2. **Check the documentation** and FAQ
3. **Try to reproduce** the issue with minimal code
4. **Gather relevant information** (browser, OS, code samples)

### Issue Templates

#### Bug Report

```markdown
**Bug Description**
A clear description of the bug.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Arduino Code**
```cpp
// Paste your Arduino code here
```

**Environment**
- Browser: [e.g., Chrome 91]
- OS: [e.g., Windows 10]
- Node.js version: [e.g., 18.0.0]

**Additional Context**
Any other context about the problem.
```

#### Feature Request

```markdown
**Feature Description**
A clear description of what you want to happen.

**Use Case**
Describe the use case and why this feature would be useful.

**Proposed Solution**
Describe the solution you'd like to see.

**Alternatives**
Alternative solutions you've considered.

**Additional Context**
Any other context or screenshots.
```

## 🔄 Pull Request Process

### PR Checklist

Before submitting a PR, ensure:

- [ ] **Tests pass** locally
- [ ] **Code is formatted** and linted
- [ ] **Documentation is updated** if needed
- [ ] **CHANGELOG is updated** for significant changes
- [ ] **PR description** is clear and detailed
- [ ] **Screenshots** are included for UI changes
- [ ] **Breaking changes** are documented

### PR Description Template

```markdown
## Description
Brief description of the changes.

## Type of Change
- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Tests pass
- [ ] New tests added
- [ ] Manual testing performed

## Screenshots
If applicable, add screenshots.

## Checklist
- [ ] Code follows the style guidelines
- [ ] Self-review of code performed
- [ ] Code is commented where necessary
- [ ] Corresponding changes made to documentation
- [ ] Tests added that prove the fix is effective or feature works
- [ ] No new warnings introduced
```

## 👀 Code Review Process

### For Contributors

- **Be open to feedback** and suggestions
- **Respond promptly** to review comments
- **Make requested changes** in a timely manner
- **Ask questions** if review comments are unclear

### For Reviewers

- **Be constructive** and helpful
- **Focus on the code**, not the person
- **Explain the reasoning** behind suggestions
- **Approve changes** when satisfied
- **Use appropriate review tools** (approve, request changes, comment)

### Review Criteria

- **Code quality** and readability
- **Test coverage** and quality
- **Performance** considerations
- **Security** implications
- **Documentation** completeness
- **Compatibility** with existing code

## 🚢 Release Process

### Version Numbering

We use [Semantic Versioning](https://semver.org/):

- **MAJOR**: Incompatible API changes
- **MINOR**: New functionality (backwards compatible)
- **PATCH**: Bug fixes (backwards compatible)

### Release Steps

1. **Update version** in `package.json`
2. **Update CHANGELOG.md** with new version
3. **Create a release branch**: `release/vX.Y.Z`
4. **Run full test suite**
5. **Build and test** production version
6. **Create a tag**: `git tag vX.Y.Z`
7. **Push tag**: `git push origin vX.Y.Z`
8. **Create GitHub release** with changelog
9. **Merge to main** branch

## 🆘 Getting Help

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Questions and general discussion
- **Discord**: Real-time chat (link in README)
- **Email**: maintainer@tft-simulator.com

### Documentation Resources

- **README.md**: Project overview and quick start
- **API.md**: Complete API documentation
- **EXAMPLES.md**: Usage examples and tutorials
- **Wiki**: Additional guides and tutorials

## 🙏 Recognition

### Contributors

We recognize contributors in several ways:

- **Contributors list** in README
- **Changelog mentions** for significant contributions
- **GitHub badges** for different contribution types
- **Special recognition** for major contributions

### Types of Contributions

We welcome all types of contributions:

- **Code**: Bug fixes, new features, refactoring
- **Documentation**: Improvements, translations, examples
- **Testing**: Test cases, bug reports, quality assurance
- **Design**: UI/UX improvements, icons, assets
- **Community**: Helping others, organizing events

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to the TFT Display Simulator! Your efforts help make this tool better for the entire Arduino and embedded development community. 🎉 