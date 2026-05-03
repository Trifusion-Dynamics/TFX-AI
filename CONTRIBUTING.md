# 🤝 Contributing to TFX AI

Thank you for your interest in contributing to TFX AI! This guide will help you get started with contributing to our project.

## 📋 Table of Contents

- [🚀 Getting Started](#-getting-started)
- [🛠️ Development Setup](#️-development-setup)
- [📝 How to Contribute](#-how-to-contribute)
- [🔍 Code Guidelines](#-code-guidelines)
- [🧪 Testing](#-testing)
- [📤 Submitting Changes](#-submitting-changes)
- [🐛 Bug Reports](#-bug-reports)
- [💡 Feature Requests](#-feature-requests)
- [📖 Documentation](#-documentation)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.14+
- Git
- Basic knowledge of React/Next.js and FastAPI

### Setup Development Environment
```bash
# Fork and clone the repository
git clone https://github.com/your-username/tfxai.git
cd tfxai

# Setup your development environment
# Follow the setup guide in SETUP.md
```

## 🛠️ Development Setup

### Backend Development
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup development database
python standalone_db_setup.py

# Start development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📝 How to Contribute

### 1. Choose an Issue
- Look for issues labeled `good first issue` for beginners
- Check `help wanted` for issues that need community help
- Create a new issue for bugs or feature requests

### 2. Create a Branch
```bash
# Create and switch to a new branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 3. Make Your Changes
- Write clean, readable code
- Follow the coding standards
- Add tests for new features
- Update documentation

### 4. Test Your Changes
```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test

# Type checking
npm run type-check
```

### 5. Submit a Pull Request
- Push your branch to your fork
- Create a pull request with a clear description
- Link any related issues
- Wait for code review

## 🔍 Code Guidelines

### Python (Backend)
- Follow [PEP 8](https://pep8.org/) style guide
- Use [Black](https://black.readthedocs.io/) for code formatting
- Use [isort](https://isort.readthedocs.io/) for import sorting
- Add type hints using [mypy](https://mypy.readthedocs.io/)
- Write docstrings for all functions and classes

```python
# Example of good Python code
from typing import List, Optional
from fastapi import HTTPException, status

async def get_user_by_id(user_id: str) -> Optional[User]:
    """
    Get a user by their ID.
    
    Args:
        user_id: The user's unique identifier
        
    Returns:
        The user object if found, None otherwise
        
    Raises:
        HTTPException: If user is not found
    """
    try:
        user = await user_service.get_user(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        return user
    except Exception as e:
        logger.error(f"Error getting user {user_id}: {e}")
        raise
```

### TypeScript (Frontend)
- Follow [TypeScript style guide](https://typescript-eslint.io/)
- Use [Prettier](https://prettier.io/) for code formatting
- Use [ESLint](https://eslint.org/) for linting
- Prefer functional components with hooks
- Use proper TypeScript types

```typescript
// Example of good TypeScript code
import React, { useState, useEffect } from 'react'
import { User } from '@/types/user'
import { userService } from '@/services/user'

interface UserProfileProps {
  userId: string
  onUpdate?: (user: User) => void
}

export const UserProfile: React.FC<UserProfileProps> = ({ 
  userId, 
  onUpdate 
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        const userData = await userService.getUser(userId)
        setUser(userData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [userId])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!user) return <div>User not found</div>

  return (
    <div className="user-profile">
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  )
}
```

### Component Guidelines
- Use descriptive component names
- Keep components small and focused
- Use props interface for TypeScript
- Add JSDoc comments for complex components

### API Guidelines
- Use RESTful conventions
- Return consistent response formats
- Include proper error handling
- Add OpenAPI documentation

## 🧪 Testing

### Backend Testing
```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_auth.py

# Run with verbose output
pytest -v
```

### Frontend Testing
```bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run linting
npm run lint

# Type checking
npm run type-check
```

### Writing Tests
- Write unit tests for all new features
- Test edge cases and error conditions
- Use descriptive test names
- Mock external dependencies

```python
# Example backend test
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_user():
    """Test creating a new user."""
    response = client.post("/api/v1/auth/register", json={
        "name": "Test User",
        "email": "test@example.com",
        "password": "Test@123456",
        "confirm_password": "Test@123456"
    })
    
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "id" in data
```

```typescript
// Example frontend test
import { render, screen, fireEvent } from '@testing-library/react'
import { UserProfile } from '@/components/UserProfile'

// Mock the user service
jest.mock('@/services/user')

describe('UserProfile', () => {
  it('should display user information', async () => {
    const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com' }
    ;(userService.getUser as jest.Mock).mockResolvedValue(mockUser)

    render(<UserProfile userId="1" />)
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('john@example.com')).toBeInTheDocument()
    })
  })
})
```

## 📤 Submitting Changes

### Pull Request Process
1. **Update Documentation**: Update README, API docs, or inline comments
2. **Add Tests**: Ensure your changes are well tested
3. **Run Tests**: Make sure all tests pass
4. **Format Code**: Run code formatting tools
5. **Create PR**: Submit a pull request with clear description

### Pull Request Template
```markdown
## Description
Brief description of your changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] All tests pass
- [ ] Added new tests
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

## 🐛 Bug Reports

### Creating a Bug Report
1. **Use the bug report template** in GitHub issues
2. **Provide clear description** of the issue
3. **Include steps to reproduce**
4. **Add error messages and logs**
5. **Specify environment details**

### Bug Report Template
```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
What you expected to happen

**Actual Behavior**
What actually happened

**Screenshots**
Add screenshots if applicable

**Environment**
- OS: [e.g. Windows 10, macOS 12.0]
- Browser: [e.g. Chrome, Firefox]
- Version: [e.g. v1.2.3]

**Additional Context**
Add any other context about the problem
```

## 💡 Feature Requests

### Requesting a Feature
1. **Check existing issues** for similar requests
2. **Use the feature request template**
3. **Provide clear use case**
4. **Explain the benefit**
5. **Consider implementation complexity**

### Feature Request Template
```markdown
**Feature Description**
Clear description of the feature

**Problem Statement**
What problem does this solve?

**Proposed Solution**
How do you envision this working?

**Alternatives Considered**
What other approaches did you consider?

**Additional Context**
Any other relevant information
```

## 📖 Documentation

### Documentation Types
- **README.md**: Project overview and quick start
- **API Documentation**: Auto-generated with FastAPI
- **Code Comments**: Inline documentation
- **Setup Guides**: Detailed setup instructions

### Writing Documentation
- Use clear, concise language
- Include code examples
- Add screenshots where helpful
- Keep documentation up to date

### Documentation Style
- Use Markdown format
- Include table of contents
- Use proper heading hierarchy
- Add code blocks with syntax highlighting

## 🎯 Code Review Process

### Review Guidelines
- Be constructive and respectful
- Focus on code quality and best practices
- Ask questions if something is unclear
- Suggest improvements, don't just point out issues

### Review Checklist
- [ ] Code follows project standards
- [ ] Tests are adequate
- [ ] Documentation is updated
- [ ] No security vulnerabilities
- [ ] Performance considerations
- [ ] Error handling is proper

## 🚀 Release Process

### Version Bumping
- Follow [Semantic Versioning](https://semver.org/)
- Update version numbers in package.json
- Create release notes
- Tag the release

### Release Notes Template
```markdown
## Version [X.Y.Z]

### Added
- New feature 1
- New feature 2

### Fixed
- Bug fix 1
- Bug fix 2

### Changed
- Breaking change 1
- Breaking change 2

### Deprecated
- Feature being deprecated

### Removed
- Feature removed
```

## 📞 Getting Help

### Community
- **Discord**: Join our community for real-time help
- **GitHub Discussions**: Ask questions and share ideas
- **Issues**: Report bugs and request features

### Resources
- [Documentation](https://docs.tfxai.com)
- [API Reference](http://localhost:8000/docs)
- [Examples](https://github.com/tfxai/examples)

## 🏆 Recognition

### Contributors
- All contributors are recognized in our README
- Top contributors get special recognition
- Contributors can join our core team

### Rewards
- Contributor badges
- Swag for significant contributions
- Opportunities for paid work

---

## 📄 License

By contributing to TFX AI, you agree that your contributions will be licensed under the same license as the project.

---

<div align="center">
  <p>🚀 Thank you for contributing to TFX AI!</p>
  <p>Every contribution helps make this project better 🌟</p>
</div>
