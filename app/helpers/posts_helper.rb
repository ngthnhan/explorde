module PostsHelper
	def get_user_vote_action(post)
		# like_button = fa_stacked_icon("thumbs-up", base: "square-o", class: "#{ 'voted' if current_user.voted_up_on? post }")
		# dislike_button = fa_stacked_icon "thumbs-down", base: "square-o", class: "#{ 'voted' if current_user.voted_down_on? post }"
		# raw "#{link_to like_button, like_post_path(post), method: :put} #{link_to dislike_button, dislike_post_path(post), method: :put}"
		if current_user.liked? post
			like_button = link_to fa_stacked_icon("thumbs-up", base: "square-o", class: "voted"), unlike_post_path(post), method: :put
		else
			like_button = link_to fa_stacked_icon("thumbs-up", base: "square-o"), like_post_path(post), method: :put
		end

		if current_user.disliked? post
			dislike_button = link_to fa_stacked_icon("thumbs-down", base: "square-o", class: "voted"), undislike_post_path(post), method: :put
		else
			dislike_button = link_to fa_stacked_icon("thumbs-down", base: "square-o"), dislike_post_path(post), method: :put
		end

		raw "#{like_button} #{dislike_button}"
	end
end
