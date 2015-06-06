module PostsHelper
	def display_rating(post)
		rating = post.get_upvotes.size - post.get_downvotes.size
		thumb = rating >= 0 ? 'like.svg' : 'dislike.svg'

		raw "#{image_tag thumb} #{rating}"
	end
end
