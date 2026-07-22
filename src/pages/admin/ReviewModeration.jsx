// src/pages/admin/ReviewModeration.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  StarIcon,
  FlagIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  UserCircleIcon,
  ClockIcon,
  TrashIcon,
  EyeIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// ----------------------------
// MOCK DATA
// ----------------------------

const mockReviews = [
  {
    id: 'r1',
    bookingId: 'BK-2026-0452',
    service: 'Pipe Repair',
    rating: 1,
    comment: 'Terrible service. The pipe still leaks and the provider was rude.',
    client: 'Sarah Adebayo',
    provider: 'John\'s Plumbing',
    date: '2026-07-20T16:30:00',
    status: 'flagged', // 'approved', 'flagged', 'pending'
    flagReason: 'Abusive language',
    reportedBy: 'Provider',
    reportedAt: '2026-07-20T17:00:00',
    photos: [],
  },
  {
    id: 'r2',
    bookingId: 'BK-2026-0448',
    service: 'Deep Cleaning',
    rating: 2,
    comment: 'Very disappointing. They didn\'t clean the kitchen properly.',
    client: 'Michael Okafor',
    provider: 'Clean & Shine',
    date: '2026-07-19T11:20:00',
    status: 'flagged',
    flagReason: 'Fake review',
    reportedBy: 'Provider',
    reportedAt: '2026-07-19T12:00:00',
    photos: [],
  },
  {
    id: 'r3',
    bookingId: 'BK-2026-0445',
    service: 'AC Installation',
    rating: 5,
    comment: 'Excellent service! The AC works perfectly and the installation was quick.',
    client: 'Chioma Eze',
    provider: 'CoolBreeze HVAC',
    date: '2026-07-18T15:40:00',
    status: 'approved',
    flagReason: null,
    reportedBy: null,
    reportedAt: null,
    photos: [],
  },
  {
    id: 'r4',
    bookingId: 'BK-2026-0438',
    service: 'Moving Services',
    rating: 4,
    comment: 'Good service overall. A few items got scratched but they handled it well.',
    client: 'Tunde Balogun',
    provider: 'Tunde Moving Logistics',
    date: '2026-07-16T12:10:00',
    status: 'pending',
    flagReason: null,
    reportedBy: null,
    reportedAt: null,
    photos: [],
  },
  {
    id: 'r5',
    bookingId: 'BK-2026-0432',
    service: 'Electrical Wiring',
    rating: 1,
    comment: 'Dangerous work. I had to call another electrician to fix it.',
    client: 'Bola Tinubu',
    provider: 'Spark Electric',
    date: '2026-07-17T09:30:00',
    status: 'flagged',
    flagReason: 'Harassment',
    reportedBy: 'Provider',
    reportedAt: '2026-07-17T10:00:00',
    photos: [],
  },
  {
    id: 'r6',
    bookingId: 'BK-2026-0443',
    service: 'Garden Design',
    rating: 5,
    comment: 'Beautiful garden design! Exceeded my expectations.',
    client: 'Emeka Nwosu',
    provider: 'Green Thumb',
    date: '2026-07-15T14:20:00',
    status: 'approved',
    flagReason: null,
    reportedBy: null,
    reportedAt: null,
    photos: [],
  },
  {
    id: 'r7',
    bookingId: 'BK-2026-0441',
    service: 'Fuse Repair',
    rating: 3,
    comment: 'Average service. Did the job but was late.',
    client: 'Mary Adebayo',
    provider: 'Spark Electric',
    date: '2026-07-14T10:00:00',
    status: 'pending',
    flagReason: null,
    reportedBy: null,
    reportedAt: null,
    photos: [],
  },
];

// ----------------------------
// HELPERS
// ----------------------------

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-NG', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const getStars = (rating) => {
  return [...Array(5)].map((_, i) => (
    <StarIcon
      key={i}
      className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
    />
  ));
};

const getStatusBadge = (status) => {
  const badges = {
    approved: { color: 'bg-green-100 text-green-800', label: 'Approved' },
    flagged: { color: 'bg-red-100 text-red-800', label: 'Flagged' },
    pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
  };
  return badges[status] || badges.pending;
};

// ----------------------------
// MAIN COMPONENT
// ----------------------------

const ReviewModeration = () => {
  const [reviews, setReviews] = useState(mockReviews);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRating, setFilterRating] = useState('all');
  const [selectedReview, setSelectedReview] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setFilteredReviews(mockReviews);
      setIsLoading(false);
    }, 500);
  }, []);

  // Filter reviews
  useEffect(() => {
    let filtered = [...reviews];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (r) =>
          r.comment.toLowerCase().includes(q) ||
          r.client.toLowerCase().includes(q) ||
          r.provider.toLowerCase().includes(q) ||
          r.service.toLowerCase().includes(q)
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((r) => r.status === filterStatus);
    }

    if (filterRating !== 'all') {
      filtered = filtered.filter((r) => r.rating === parseInt(filterRating));
    }

    setFilteredReviews(filtered);
  }, [searchQuery, filterStatus, filterRating, reviews]);

  // Handle approve review
  const handleApprove = async (reviewId) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId ? { ...r, status: 'approved' } : r
        )
      );
      toast.success('Review approved successfully');
      if (selectedReview?.id === reviewId) {
        setSelectedReview({ ...selectedReview, status: 'approved' });
      }
    } catch (error) {
      toast.error('Failed to approve review');
    }
  };

  // Handle delete review
  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return;
    }
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      toast.success('Review deleted successfully');
      setIsDetailOpen(false);
      setSelectedReview(null);
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  // Handle review click
  const handleReviewClick = (review) => {
    setSelectedReview(review);
    setIsDetailOpen(true);
  };

  // Stats
  const total = reviews.length;
  const approved = reviews.filter((r) => r.status === 'approved').length;
  const flagged = reviews.filter((r) => r.status === 'flagged').length;
  const pending = reviews.filter((r) => r.status === 'pending').length;
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / total || 0;

  // ----- Render Detail View -----
  const renderDetail = () => {
    if (!selectedReview) return null;
    const r = selectedReview;
    const status = getStatusBadge(r.status);

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm flex justify-end"
        onClick={() => setIsDetailOpen(false)}
      >
        <div
          className="bg-white w-full max-w-2xl h-full overflow-y-auto p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Review Details</h2>
            <button
              onClick={() => setIsDetailOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <XCircleIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Booking: {r.bookingId}</p>
                <p className="font-medium text-gray-900">{r.service}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                {status.label}
              </span>
            </div>

            {/* Client & Provider */}
            <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4">
              <div>
                <p className="text-sm text-gray-500">Client</p>
                <p className="font-medium text-gray-800">{r.client}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Provider</p>
                <p className="font-medium text-gray-800">{r.provider}</p>
              </div>
            </div>

            {/* Rating */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Rating</p>
              <div className="flex items-center gap-2">
                <div className="flex">{getStars(r.rating)}</div>
                <span className="font-bold text-gray-800">{r.rating}.0</span>
              </div>
            </div>

            {/* Comment */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Comment</p>
              <p className="text-gray-700 bg-gray-50 rounded-lg p-3">{r.comment}</p>
            </div>

            {/* Flag Info */}
            {r.status === 'flagged' && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-red-700">
                  <FlagIcon className="w-5 h-5" />
                  <p className="font-medium">Flagged Review</p>
                </div>
                <p className="text-sm text-red-600 mt-1">
                  Reason: {r.flagReason}
                  {r.reportedBy && ` • Reported by: ${r.reportedBy}`}
                  {r.reportedAt && ` • ${formatDate(r.reportedAt)}`}
                </p>
              </div>
            )}

            {/* Actions */}
            {r.status !== 'approved' && (
              <div className="border-t border-gray-200 pt-6 flex gap-3">
                <button
                  onClick={() => handleApprove(r.id)}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
                >
                  <CheckCircleIcon className="w-5 h-5" />
                  Approve Review
                </button>
                <button
                  onClick={() => handleDelete(r.id)}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
                >
                  <TrashIcon className="w-5 h-5" />
                  Delete Review
                </button>
              </div>
            )}

            {r.status === 'approved' && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center text-green-700">
                <CheckCircleIcon className="w-6 h-6 inline mr-2" />
                This review has been approved and is publicly visible.
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Review Moderation</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and moderate user reviews</p>
        </div>
        <div className="mt-3 sm:mt-0 flex items-center gap-2">
          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
            ⭐ {avgRating.toFixed(1)} Average
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{total}</div>
          <div className="text-sm text-gray-500">Total Reviews</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{approved}</div>
          <div className="text-sm text-gray-500">Approved</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{flagged}</div>
          <div className="text-sm text-gray-500">Flagged</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">{pending}</div>
          <div className="text-sm text-gray-500">Pending</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by comment, client, provider..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white text-gray-700"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="flagged">Flagged</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <div>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white text-gray-700"
            >
              <option value="all">All Ratings</option>
              <option value="5">⭐ 5 Stars</option>
              <option value="4">⭐ 4 Stars</option>
              <option value="3">⭐ 3 Stars</option>
              <option value="2">⭐ 2 Stars</option>
              <option value="1">⭐ 1 Star</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <StarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900">No reviews found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => {
            const status = getStatusBadge(review.status);
            return (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition cursor-pointer"
                onClick={() => handleReviewClick(review)}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex">{getStars(review.rating)}</div>
                      <span className="text-sm font-medium text-gray-800">{review.rating}.0</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-gray-600">{review.service}</span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1 line-clamp-2">{review.comment}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-400">
                      <span>Client: {review.client}</span>
                      <span>•</span>
                      <span>Provider: {review.provider}</span>
                      <span>•</span>
                      <span>{formatDate(review.date)}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                      {status.label}
                    </span>
                    {review.status === 'flagged' && (
                      <span className="flex items-center gap-1 text-xs text-red-600">
                        <FlagIcon className="w-3 h-3" />
                        {review.flagReason}
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReviewClick(review);
                      }}
                      className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      Review
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {isDetailOpen && renderDetail()}
      </AnimatePresence>
    </div>
  );
};

export default ReviewModeration;